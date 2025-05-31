import {
  Injectable,
  ConflictException,
  BadRequestException,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { Role } from '../auth/enums/role.enum';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dto/update-user.dto';
import { first } from 'rxjs';
import { AzureStorageService } from 'src/azure-storage/azure-storage.service';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(private prisma: PrismaService, private azureStorageService: AzureStorageService, // Inject AzureStorageService
  ) { }

  async findAll() {
    return this.prisma.user.findMany({
      include: {
        administrator: true,
        client: true,
        serviceProvider: true,
      },
    });
  }
  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
      include: {
        administrator: true,
        client: true,
        serviceProvider: true,
      },
    });
  }

  async findById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      include: {
        administrator: true,
        client: true,
        serviceProvider: true,
      },
    });
  }

  async create(createUserDto: CreateUserDto, avatarFile?: Express.Multer.File) {
    const { email, password, role, firstName, lastName, contactInfo, companyName, location } =
      createUserDto;

    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('Email already in use');
    }

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    let avatarUrl: string | undefined;

    // Handle avatar upload if a file is provided
    if (avatarFile) {
      try {
        // Use a folder related to the email for new registrations
        const folderPath = `avatars/user-email-${email.replace(/[^a-zA-Z0-9]/g, '_')}`;
        avatarUrl = await this.azureStorageService.uploadFile(
          avatarFile.buffer,
          avatarFile.originalname,
          folderPath,
        );
        this.logger.log(`Avatar uploaded during registration for ${email}: ${avatarUrl}`);
      } catch (error) {
        this.logger.error(`Error uploading avatar during registration for ${email}: ${error.message}`, error.stack);
        throw new BadRequestException('Failed to upload avatar during registration. Please try again.');
      }
    }

    try {
      const createdUser = await this.prisma.$transaction(async (prisma) => {
        const user = await prisma.user.create({
          data: {
            email,
            passwordHash,
            avatarUrl, // This will be undefined if no avatar was uploaded
          },
        });

        switch (role) {
          case Role.ADMINISTRATOR:
            await prisma.administrator.create({
              data: { userId: user.id, firstName, lastName, contactInfo },
            });
            break;
          case Role.CLIENT:
            await prisma.client.create({
              data: { userId: user.id, firstName, lastName, contactInfo, location },
            });
            break;
          case Role.SERVICE_PROVIDER:
            await prisma.serviceProvider.create({
              data: { userId: user.id, firstName, lastName, companyName, contactInfo },
            });
            break;
          default:
            throw new BadRequestException('Invalid role specified');
        }

        return prisma.user.findUnique({
          where: { id: user.id },
          include: { administrator: true, client: true, serviceProvider: true },
        });
      });

      return createdUser;
    } catch (error) {
      if (avatarUrl) {
        try {
          const blobName = this.azureStorageService.getBlobNameFromUrl(avatarUrl);
          if (blobName) {
            await this.azureStorageService.deleteFile(blobName);
            this.logger.warn(`Cleaned up orphaned avatar after user creation failure: ${avatarUrl}`);
          }
        } catch (cleanupError) {
          this.logger.error(`Failed to clean up orphaned avatar: ${cleanupError.message}`);
        }
      }
      if (error instanceof BadRequestException || error instanceof ConflictException) {
        throw error;
      }
      this.logger.error(`Failed to create user: ${error.message}`, error.stack);
      throw new BadRequestException('Failed to create user');
    }
  }

  async getUserRole(userId: string): Promise<Role | null> {
    const user = await this.findById(userId);

    if (!user) return null;

    if (user.administrator) return Role.ADMINISTRATOR;
    if (user.client) return Role.CLIENT;
    if (user.serviceProvider) return Role.SERVICE_PROVIDER;

    return null;
  }
  async update(id: string, updateUserDto: UpdateUserDto, avatarFile?: Express.Multer.File) {
    const { email, password, firstName, lastName, contactInfo, companyName, location } =
      updateUserDto;

    const existingUser = await this.findById(id);
    if (!existingUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    if (email && email !== existingUser.email) {
      const emailTaken = await this.prisma.user.findUnique({
        where: { email },
      });
      if (emailTaken) {
        throw new ConflictException('Email already in use');
      }
    }

    const userData: any = {};
    if (email) userData.email = email;
    if (password) {
      const salt = await bcrypt.genSalt();
      userData.passwordHash = await bcrypt.hash(password, salt);
    }

    // --- Handle avatar update/replacement ---
    if (avatarFile) {
      try {
        if (existingUser.avatarUrl) {
          const oldBlobName = this.azureStorageService.getBlobNameFromUrl(existingUser.avatarUrl);
          if (oldBlobName) {
            await this.azureStorageService.deleteFile(oldBlobName);
            this.logger.log(`Old avatar deleted for user ${id}: ${existingUser.avatarUrl}`);
          } else {
            this.logger.warn(`Could not determine blob name from URL for user ${id}: ${existingUser.avatarUrl}`);
          }
        }

        const folderPath = `avatars/user-${id}`; // Use actual user ID for the folder
        const newAvatarUrl = await this.azureStorageService.uploadFile(
          avatarFile.buffer,
          avatarFile.originalname,
          folderPath,
        );
        userData.avatarUrl = newAvatarUrl;
        this.logger.log(`New avatar uploaded for user ${id}: ${newAvatarUrl}`);
      } catch (error) {
        this.logger.error(`Error updating avatar for user ${id}: ${error.message}`, error.stack);
        throw new BadRequestException('Failed to update avatar.');
      }
    } else if (Object.prototype.hasOwnProperty.call(updateUserDto, 'avatarUrl') && updateUserDto.avatarUrl === null) {
      await this.removeAvatar(id);
      userData.avatarUrl = null;
    }

    try {
      const updatedUser = await this.prisma.$transaction(async (prisma) => {
        await prisma.user.update({
          where: { id },
          data: userData,
        });

        if (existingUser.administrator) {
          await prisma.administrator.update({
            where: { userId: id },
            data: {
              firstName: firstName ?? undefined,
              lastName: lastName ?? undefined,
              contactInfo: contactInfo ?? undefined,
            },
          });
        } else if (existingUser.client) {
          await prisma.client.update({
            where: { userId: id },
            data: {
              firstName: firstName ?? undefined,
              lastName: lastName ?? undefined,
              contactInfo: contactInfo ?? undefined,
              location: location ?? undefined,
            },
          });
        } else if (existingUser.serviceProvider) {
          await prisma.serviceProvider.update({
            where: { userId: id },
            data: {
              companyName: companyName ?? undefined,
              contactInfo: contactInfo ?? undefined,
            },
          });
        }

        return this.findById(id);
      });
      return updatedUser;
    } catch (error) {
      this.logger.error(`Failed to update user ${id}: ${error.message}`, error.stack);
      throw new BadRequestException('Failed to update user');
    }
  }
  async removeAvatar(userId: string): Promise<void> {
    const user = await this.findById(userId);
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found.`);
    }

    if (!user.avatarUrl) {
      this.logger.warn(`User ${userId} does not have an avatar to remove.`);
      return;
    }

    try {
      const blobName = this.azureStorageService.getBlobNameFromUrl(user.avatarUrl);
      if (blobName) {
        await this.azureStorageService.deleteFile(blobName);
        this.logger.log(`Avatar deleted from Azure for user ${userId}: ${user.avatarUrl}`);
      } else {
        this.logger.warn(`Could not determine blob name from URL for user ${userId}: ${user.avatarUrl}`);
      }

      await this.prisma.user.update({
        where: { id: userId },
        data: { avatarUrl: null },
      });
      this.logger.log(`Avatar URL cleared in DB for user ${userId}.`);
    } catch (error) {
      this.logger.error(`Failed to remove avatar for user ${userId}: ${error.message}`, error.stack);
      throw new BadRequestException('Failed to remove user avatar.');
    }
  }

  // --- DELETE USER (with avatar deletion) ---
  async remove(id: string) {
    const user = await this.findById(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    try {
      return await this.prisma.$transaction(async (prisma) => {
        if (user.administrator) {
          await prisma.administrator.delete({ where: { userId: id } });
        } else if (user.client) {
          await prisma.client.delete({ where: { userId: id } });
        } else if (user.serviceProvider) {
          await prisma.serviceProvider.delete({ where: { userId: id } });
        }

        if (user.avatarUrl) {
          const blobName = this.azureStorageService.getBlobNameFromUrl(user.avatarUrl);
          if (blobName) {
            await this.azureStorageService.deleteFile(blobName);
            this.logger.log(`Avatar deleted from Azure for user ${id}: ${user.avatarUrl}`);
          } else {
            this.logger.warn(`Could not determine blob name from URL for user ${id}: ${user.avatarUrl}`);
          }
        }

        return prisma.user.delete({
          where: { id },
        });
      });
    } catch (error) {
      this.logger.error(`Failed to delete user ${id}: ${error.message}`, error.stack);
      throw new BadRequestException('Failed to delete user');
    }
  }
}

