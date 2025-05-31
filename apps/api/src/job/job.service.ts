import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { JobStatus, RequestStatus, RequestType } from 'generated/prisma';
import { CreateJobRequestDto } from './dto/create-job-request.dto';
import { AzureStorageService } from 'src/azure-storage/azure-storage.service';
@Injectable()
export class JobService {
  constructor(
    private prisma: PrismaService,
    private azureStorageService: AzureStorageService, // Assuming you have an AzureStorageService for file uploads
  ) { }

  // Create a new job and notify matching providers
  async createJob(
    clientId: string,
    createJobDto: CreateJobDto,
    imageFiles?: Express.Multer.File[],
  ) {
    const { categoryId, location, ...jobData } = createJobDto;

    // Verify client exists
    const client = await this.prisma.client.findUnique({
      where: { userId: clientId },
    });

    if (!client) {
      throw new NotFoundException('Client not found');
    }

    // Validate image count
    if (imageFiles && imageFiles.length > 20) {
      throw new BadRequestException('Maximum 20 images allowed per job');
    }

    let jobMediaData: {
      mediaUrl: string;
      mediaType: string;
      caption?: string;
    }[] = [];

    // Upload images to Azure if provided
    if (imageFiles && imageFiles.length > 0) {
      try {
        const uploadPromises = imageFiles.map(async (file) => {
          const mediaUrl = await this.azureStorageService.uploadFile(
            file.buffer,
            file.originalname,
            'jobs' // folder name for job images
          );

          return {
            mediaUrl,
            mediaType: 'photo', // Hardcoded as 'photo'
            caption: file.originalname, // Use original name as caption
          };
        });

        jobMediaData = await Promise.all(uploadPromises);
      } catch (error) {
        throw new BadRequestException(`Failed to upload images: ${error.message}`);
      }
    }

    // Create the job with images
    const job = await this.prisma.job.create({
      data: {
        ...jobData,
        clientId,
        categoryId,
        location,
        status: JobStatus.OPEN,
        media: {
          create: jobMediaData, // Create related JobMedia records
        },
      },
      include: {
        media: true,
        client: {
          include: { user: true },
        },
        category: true,
      },
    });

    // Find matching service providers and send notifications
    // ... your existing notification logic here

    return job;
  }
  async addImagesToJob(
    jobId: string,
    imageFiles: Express.Multer.File[],
    userId: string,
  ) {
    try {
      // Check if user owns the job
      const job = await this.prisma.job.findFirst({
        where: {
          id: jobId,
          clientId: userId
        },
        include: {
          media: true
        },
      });

      if (!job) {
        throw new NotFoundException('Job not found or you are not authorized to modify it');
      }

      // Check current image count + new images doesn't exceed 20
      const currentImageCount = job.media.length;
      if (currentImageCount + imageFiles.length > 20) {
        throw new BadRequestException(
          `Cannot add ${imageFiles.length} images. Maximum 20 images allowed per job. Current: ${currentImageCount}`
        );
      }

      // Upload new images to Azure
      const uploadPromises = imageFiles.map(async (file) => {
        const mediaUrl = await this.azureStorageService.uploadFile(
          file.buffer,
          file.originalname,
          'jobs'
        );

        return {
          mediaUrl,
          mediaType: file.mimetype.startsWith('image/') ? 'image' : 'file',
          jobId,
        };
      });

      const newMediaData = await Promise.all(uploadPromises);

      // Add images to database
      await this.prisma.jobMedia.createMany({
        data: newMediaData,
      });

      // Return updated job with all media
      return this.prisma.job.findUnique({
        where: { id: jobId },
        include: {
          media: true,
          category: true,
          client: true,
        },
      });
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(`Failed to add images: ${error.message}`);
    }
  }

  async removeImageFromJob(jobId: string, mediaId: string, userId: string) {
    try {
      // Check if user owns the job
      const job = await this.prisma.job.findFirst({
        where: {
          id: jobId,
          clientId: userId
        },
      });

      if (!job) {
        throw new NotFoundException('Job not found or you are not authorized to modify it');
      }

      // Get the media record
      const media = await this.prisma.jobMedia.findFirst({
        where: {
          id: mediaId,
          jobId
        },
      });

      if (!media) {
        throw new NotFoundException('Image not found');
      }

      // Delete from Azure Storage
      const blobName = this.azureStorageService.getBlobNameFromUrl(media.mediaUrl);
      if (blobName) {
        try {
          await this.azureStorageService.deleteFile(blobName);
        } catch (error) {
          console.error('Failed to delete from Azure Storage:', error);
          // Continue with database deletion even if Azure deletion fails
        }
      }

      // Delete from database
      await this.prisma.jobMedia.delete({
        where: { id: mediaId },
      });

      return {
        message: 'Image removed successfully',
        removedImageId: mediaId
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(`Failed to remove image: ${error.message}`);
    }
  }
  async getClientJobs(
    clientId: string,
    page: number,
    pageSize: number,
    searchTerm?: string,
    categoryId?: string,
    status?: string,
    orderBy: 'asc' | 'desc' = 'desc', // default desc
  ) {
    const whereClause: any = { clientId };

    if (categoryId) {
      whereClause.categoryId = categoryId;
    }

    if (status && status !== 'All') {
      whereClause.status = status;
    }

    if (searchTerm && searchTerm.trim() !== '') {
      whereClause.OR = [
        { title: { contains: searchTerm, mode: 'insensitive' } },
        { description: { contains: searchTerm, mode: 'insensitive' } },
      ];
    }

    const skip = (page - 1) * pageSize;

    const [jobs, totalCount] = await Promise.all([
      this.prisma.job.findMany({
        where: whereClause,
        include: {
          category: true,
          provider: { include: { user: true } },
          jobRequests: { include: { requester: true, target: true } },
        },
        orderBy: { createdAt: orderBy },
        skip: skip,
        take: pageSize,
      }),
      this.prisma.job.count({ where: whereClause }),
    ]);

    const totalPages = Math.ceil(totalCount / pageSize);

    return {
      jobs,
      totalCount,
      currentPage: page,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    };
  }
  async sendJobRequest(requesterId: string, createJobRequestDto: CreateJobRequestDto) {
    const { jobId, targetId, type, message } = createJobRequestDto;

    // Verify job exists and is open
    const job = await this.prisma.job.findUnique({
      where: { id: jobId },
      include: {
        client: true,
        provider: true,
      },
    });

    if (!job) {
      throw new NotFoundException('Job not found');
    }

    if (job.status !== JobStatus.OPEN) {
      throw new BadRequestException('Job is not open for requests');
    }

    // Validate request type and permissions
    if (type === RequestType.CLIENT_TO_PROVIDER) {
      if (job.clientId !== requesterId) {
        throw new ForbiddenException('Only job owner can send client requests');
      }
    } else if (type === RequestType.PROVIDER_TO_CLIENT) {
      const provider = await this.prisma.serviceProvider.findUnique({
        where: { userId: requesterId },
      });
      if (!provider) {
        throw new ForbiddenException('Only service providers can send provider requests');
      }
    }

    // Check for existing request
    const existingRequest = await this.prisma.jobRequest.findFirst({
      where: {
        jobId,
        requesterId,
        targetId,
      },
    });

    if (existingRequest) {
      throw new BadRequestException('Request already exists');
    }

    // Create the request
    const jobRequest = await this.prisma.jobRequest.create({
      data: {
        jobId,
        requesterId,
        targetId,
        type,
        message,
        status: RequestStatus.PENDING,
      },
      include: {
        job: {
          include: { category: true },
        },
        requester: true,
        target: true,
      },
    });

    return jobRequest;
  }
  async respondToJobRequest(requestId: string, userId: string, status: RequestStatus) {
    const request = await this.prisma.jobRequest.findUnique({
      where: { id: requestId },
      include: {
        job: true,
        requester: true,
        target: true,
      },
    });

    if (!request) {
      throw new NotFoundException('Job request not found');
    }

    if (request.targetId !== userId) {
      throw new ForbiddenException('You can only respond to requests sent to you');
    }

    if (request.status !== RequestStatus.PENDING) {
      throw new BadRequestException('Request has already been responded to');
    }

    // Update request status
    const updatedRequest = await this.prisma.jobRequest.update({
      where: { id: requestId },
      data: {
        status,
        respondedAt: new Date(),
      },
      include: {
        job: true,
        requester: true,
        target: true,
      },
    });

    // If accepted, enable chat between users
    if (status === RequestStatus.ACCEPTED) {
      // If accepted, enable chat between users

    }

    return updatedRequest;
  }
  async assignProviderToJob(jobId: string, providerId: string, clientId: string) {
    // Verify job belongs to client and is open
    const job = await this.prisma.job.findUnique({
      where: { id: jobId },
      include: {
        client: true,
        jobRequests: {
          where: {
            OR: [
              { requesterId: providerId, targetId: clientId },
              { requesterId: clientId, targetId: providerId },
            ],
            status: RequestStatus.ACCEPTED,
          },
        },
      },
    });

    if (!job) {
      throw new NotFoundException('Job not found');
    }

    if (job.clientId !== clientId) {
      throw new ForbiddenException('Only job owner can assign providers');
    }

    if (job.status !== JobStatus.OPEN) {
      throw new BadRequestException('Job is not open');
    }

    // Verify there's an accepted request between client and provider
    if (job.jobRequests.length === 0) {
      throw new BadRequestException('No accepted request found between client and provider');
    }

    // Assign provider and close job
    const updatedJob = await this.prisma.job.update({
      where: { id: jobId },
      data: {
        providerId,
        status: JobStatus.IN_PROGRESS,
      },
      include: {
        client: {
          include: { user: true },
        },
        provider: {
          include: { user: true },
        },
        category: true,
      },
    });

    // Notify assigned provider
    // await this.notificationService.sendJobAssignmentNotification(providerId, jobId);

    return updatedJob;
  }

  // Close job (by client)
  async closeJob(jobId: string, clientId: string, reason: string) {
    const job = await this.prisma.job.findUnique({
      where: { id: jobId },
    });

    if (!job) {
      throw new NotFoundException('Job not found');
    }

    if (job.clientId !== clientId) {
      throw new ForbiddenException('Only job owner can close the job');
    }

    if (job.status === JobStatus.COMPLETED || job.status === JobStatus.CLOSED) {
      throw new BadRequestException('Job is already closed');
    }

    return this.prisma.job.update({
      where: { id: jobId },
      data: {
        status: JobStatus.CLOSED,
        closedAt: new Date(),
        closedReason: reason,
      },
    });
  }

  // Complete job
  async completeJob(jobId: string, clientId: string) {
    const job = await this.prisma.job.findUnique({
      where: { id: jobId },
    });

    if (!job) {
      throw new NotFoundException('Job not found');
    }

    if (job.clientId !== clientId) {
      throw new ForbiddenException('Only job owner can complete the job');
    }

    if (job.status !== JobStatus.IN_PROGRESS) {
      throw new BadRequestException('Job must be in progress to complete');
    }

    return this.prisma.job.update({
      where: { id: jobId },
      data: {
        status: JobStatus.COMPLETED,
        completionDate: new Date(),
      },
    });
  }

  // Get recommended providers for a job
  async getRecommendedProviders(jobId: string, clientId: string) {
    const job = await this.prisma.job.findUnique({
      where: { id: jobId },
    });

    if (!job) {
      throw new NotFoundException('Job not found');
    }

    if (job.clientId !== clientId) {
      throw new ForbiddenException('Access denied');
    }

    // Find providers with matching specialties and location
    return this.prisma.serviceProvider.findMany({
      where: {
        isValidated: true,
        specialties: {
          some: {
            categoryId: job.categoryId,
          },
        },
        location: {
          contains: job.location ?? undefined,
          mode: 'insensitive',
        },
      },
      include: {
        user: true,

        ratings: {
          select: {
            score: true,
          },
        },
        reviews: {
          take: 3,
          orderBy: { createdAt: 'desc' },
        },
      },
      take: 10,
    });
  }

  findAll() {
    return `This action returns all job`;
  }

  async findOne(jobId: string, userId: string) {
    const job = await this.prisma.job.findUnique({
      where: { id: jobId },
      include: {
        client: {
          include: { user: true },
        },
        media: true,
        provider: {
          include: { user: true },
        },
        category: true,
        jobRequests: {
          include: {
            requester: {
              include: {
                client: true,
                serviceProvider: { include: { ratings: true, reviews: true, specialties: { include: { category: true } } } }
              },
            },
            target: {
              include: {
                client: true,
                serviceProvider: { include: { ratings: true, reviews: true } }
              },
            }
          },
        },
        messages: {
          include: {
            sender: true,
            receiver: true,
          },
          orderBy: { timestamp: 'asc' },
        },
      },
    });

    if (!job) {
      throw new NotFoundException('Job not found');
    }

    // Check if user has access to this job
    const hasAccess =
      job.clientId === userId ||
      job.providerId === userId ||
      job.jobRequests.some(req =>
        req.requesterId === userId || req.targetId === userId
      );

    if (!hasAccess) {
      throw new ForbiddenException('Access denied');
    }

    return job;
  }


  update(id: number, updateJobDto: UpdateJobDto) {
    return `This action updates a #${id} job`;
  }

  remove(id: number) {
    return `This action removes a #${id} job`;
  }
}
