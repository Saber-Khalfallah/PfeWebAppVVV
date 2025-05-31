import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service'; // Adjust path as needed
import { CreateServiceCategoryDto } from './dto/create-service-category.dto';
import { UpdateServiceCategoryDto } from './dto/update-service-category.dto';
import { ServiceCategory, Prisma } from 'generated/prisma'; // Adjust path as needed

@Injectable()
export class ServiceCategoryService {
  constructor(private prisma: PrismaService) {}

  async create(createServiceCategoryDto: CreateServiceCategoryDto): Promise<ServiceCategory> {
    try {
      return await this.prisma.serviceCategory.create({
        data: createServiceCategoryDto,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        // P2002 is the error code for unique constraint violation
        if (error.code === 'P2002') {
          throw new ConflictException('A service category with this name already exists');
        }
      }
      throw error;
    }
  }

  async findAll(includeStats = false) {
    const include = includeStats ? {
      _count: {
        select: {
          jobs: true,
          providers: true,
        },
      },
    } : undefined;

    return this.prisma.serviceCategory.findMany({
      include,
      orderBy: {
        name: 'asc',
      },
    });
  }

  async findOne(id: string, includeStats = false) {
    const include = includeStats ? {
      _count: {
        select: {
          jobs: true,
          providers: true,
        },
      },
    } : undefined;

    const serviceCategory = await this.prisma.serviceCategory.findUnique({
      where: { id },
      include,
    });

    if (!serviceCategory) {
      throw new NotFoundException(`Service category with ID ${id} not found`);
    }

    return serviceCategory;
  }

  async findByName(name: string): Promise<ServiceCategory | null> {
    return this.prisma.serviceCategory.findUnique({
      where: { name },
    });
  }

  async update(id: string, updateServiceCategoryDto: UpdateServiceCategoryDto): Promise<ServiceCategory> {
    try {
      const serviceCategory = await this.prisma.serviceCategory.update({
        where: { id },
        data: updateServiceCategoryDto,
      });
      return serviceCategory;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException(`Service category with ID ${id} not found`);
        }
        if (error.code === 'P2002') {
          throw new ConflictException('A service category with this name already exists');
        }
      }
      throw error;
    }
  }

  async remove(id: string): Promise<ServiceCategory> {
    try {
      // Check if category has associated jobs or providers
      const categoryWithRelations = await this.prisma.serviceCategory.findUnique({
        where: { id },
        include: {
          _count: {
            select: {
              jobs: true,
              providers: true,
            },
          },
        },
      });

      if (!categoryWithRelations) {
        throw new NotFoundException(`Service category with ID ${id} not found`);
      }

      if (categoryWithRelations._count.jobs > 0 || categoryWithRelations._count.providers > 0) {
        throw new BadRequestException(
          'Cannot delete service category that has associated jobs or service providers'
        );
      }

      return await this.prisma.serviceCategory.delete({
        where: { id },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException(`Service category with ID ${id} not found`);
        }
      }
      throw error;
    }
  }

  async getJobsByCategory(categoryId: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    
    const [jobs, total] = await Promise.all([
      this.prisma.job.findMany({
        where: { categoryId },
        skip,
        take: limit,
        include: {
          client: {
            include: {
              user: {
                select: {
                  email: true,
                  avatarUrl: true,
                },
              },
            },
          },
          provider: {
            include: {
              user: {
                select: {
                  email: true,
                  avatarUrl: true,
                },
              },
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this.prisma.job.count({
        where: { categoryId },
      }),
    ]);

    return {
      jobs,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getProvidersByCategory(categoryId: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    
    const [providers, total] = await Promise.all([
      this.prisma.serviceProvider.findMany({
        where: {
          specialties: {
            some: {
              categoryId,
            },
          },
        },
        skip,
        take: limit,
        include: {
          user: {
            select: {
              email: true,
              avatarUrl: true,
            },
          },
          
          _count: {
            select: {
              ratings: true,
              assignedJobs: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this.prisma.serviceProvider.count({
        where: {
          specialties: {
            some: {
              categoryId,
            },
          },
        },
      }),
    ]);

    return {
      providers,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}