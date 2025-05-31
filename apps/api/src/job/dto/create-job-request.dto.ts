import { IsString, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';
import { RequestType } from 'generated/prisma'

export class CreateJobRequestDto {
  @IsString()
  @IsNotEmpty()
  jobId: string;

  @IsString()
  @IsNotEmpty()
  targetId: string;

  @IsEnum(RequestType)
  type: RequestType;

  @IsOptional()
  @IsString()
  message?: string;
}