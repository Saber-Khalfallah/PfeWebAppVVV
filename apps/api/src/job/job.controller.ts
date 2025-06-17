import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Query, ParseUUIDPipe, DefaultValuePipe, ParseIntPipe, UseInterceptors, UploadedFiles, BadRequestException } from '@nestjs/common';
import { JobService } from './job.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/enums/role.enum';
import { JobStatus } from 'generated/prisma';
import { CreateJobRequestDto } from './dto/create-job-request.dto';
import { RespondJobRequestDto } from './dto/respond-job-request.dto';
import { CloseJobDto } from './dto/close-job.dto';
import { AssignProviderDto } from './dto/assign-provider.dto';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller('job')
@UseGuards(JwtAuthGuard)

export class JobController {
  constructor(private readonly jobService: JobService) { }

  @Post()
  @UseGuards(RolesGuard)
  @Roles(Role.CLIENT)
  @UseInterceptors(FilesInterceptor('images', 20)) // Max 20 images, field name 'images'
  async createJob(
    @Body() createJobDto: CreateJobDto,
    @UploadedFiles() images: Express.Multer.File[],
    @Request() req, // Assuming you have authentication middleware
  ) {
    // Validate image count
    if (images && images.length > 20) {
      throw new BadRequestException('Maximum 20 images allowed per job');
    }

    return this.jobService.createJob(req.user.userId, createJobDto, images);
  }

  @Get('my-jobs')
  @UseGuards(RolesGuard)
  @Roles(Role.CLIENT)
  async getMyJobs(
    @Request() req,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('pageSize', new DefaultValuePipe(10), ParseIntPipe) pageSize: number,
    @Query('searchTerm') searchTerm?: string,
    @Query('categoryId') categoryId?: string,
    @Query('status') status?: string,
    @Query('orderBy') orderBy: 'asc' | 'desc' = 'desc', // default descending
  ) {
    const validatedPage = Math.max(1, page);
    const validatedPageSize = Math.max(1, pageSize);

    return this.jobService.getClientJobs(
      req.user.userId,
      validatedPage,
      validatedPageSize,
      searchTerm,
      categoryId,
      status,
      orderBy,
    );
  }

  @Post('requests')
  async sendJobRequest(
    @Request() req,
    @Body() createJobRequestDto: CreateJobRequestDto,
  ) {
    return this.jobService.sendJobRequest(req.user.userId, createJobRequestDto);
  }
  @Patch('requests/:id/respond')
  async respondToJobRequest(
    @Param('id', ParseUUIDPipe) id: string,
    @Request() req,
    @Body() respondJobRequestDto: RespondJobRequestDto,
  ) {
    return this.jobService.respondToJobRequest(
      id,
      req.user.userId,
      respondJobRequestDto.status,
    );
  }
  @Get(':id/recommended-providers')
  @UseGuards(RolesGuard)
  @Roles(Role.CLIENT)
  async getRecommendedProviders(
    @Param('id', ParseUUIDPipe) id: string,
    @Request() req,
  ) {
    return this.jobService.getRecommendedProviders(id, req.user.userId);
  }
  @Post(':id/assign')
  @UseGuards(RolesGuard)
  @Roles(Role.CLIENT)
  async assignProvider(
    @Param('id', ParseUUIDPipe) jobId: string,
    @Request() req,
    @Body() assignProviderDto: AssignProviderDto,
  ) {
    console.log('Assigning provider with:', {
      jobId,
      providerId: assignProviderDto.providerId,
      clientId: req.user.userId // This is the correct client ID from the JWT token
    });

    return this.jobService.assignProviderToJob(
      jobId,
      assignProviderDto.providerId,
      req.user.userId // Use the client ID from the JWT token
    );
  }

  // Complete job
  @Patch(':id/complete')
  @UseGuards(RolesGuard)
  @Roles(Role.CLIENT)
  async completeJob(
    @Param('id', ParseUUIDPipe) id: string,
    @Request() req,
  ) {
    return this.jobService.completeJob(id, req.user.userId);
  }

  // Close job
  @Patch(':id/close')
  @UseGuards(RolesGuard)
  @Roles(Role.CLIENT)
  async closeJob(
    @Param('id', ParseUUIDPipe) id: string,
    @Request() req,
    @Body() closeJobDto: CloseJobDto,
  ) {
    return this.jobService.closeJob(id, req.user.userId, closeJobDto.reason);
  }
  // Add this to your existing JobController class
  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.CLIENT)
  @UseInterceptors(FilesInterceptor('images', 20))
  async updateJob(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateJobDto: UpdateJobDto,
    @UploadedFiles() images: Express.Multer.File[],
    @Request() req,
    @Body('removedImages') removedImages: string[], // Receive the removedImages array
  ) {
    // Validate image count
    console.log('Removed Images:', removedImages); // Check if removedImages are received

    if (images && images.length > 20) {
      throw new BadRequestException('Maximum 20 images allowed per job');
    }

    return this.jobService.updateJob(id, req.user.userId, updateJobDto, images, removedImages);
  }

  // Get single job details
  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string, @Request() req) {
    // Add authorization logic to ensure user can access this job
    return this.jobService.findOne(id, req.user.userId);
  }
}
