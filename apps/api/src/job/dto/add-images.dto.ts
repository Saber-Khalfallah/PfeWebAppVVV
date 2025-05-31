// src/jobs/dto/add-images.dto.ts
import { IsOptional, IsString } from 'class-validator';

export class AddImagesDto {
  @IsOptional()
  @IsString()
  description?: string; // Optional description for the images
}