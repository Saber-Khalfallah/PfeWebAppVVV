// src/jobs/dto/create-job.dto.ts
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsUUID,
  IsDateString,
  IsNumber,
  Min,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateJobDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsUUID() // Ensures the categoryId is a valid UUID
  @IsNotEmpty()
  categoryId: string;

  @IsString()
  @IsOptional()
  location?: string;

  @IsDateString() // Validates that the string is a valid ISO 8601 date string
  @IsNotEmpty()
  requestedDatetime: string; // This will be converted to a Date object in your service

  @IsNumber({ maxDecimalPlaces: 2 }) // Ensures it's a number with at most 2 decimal places
  @Min(0) // Ensures the number is not negative
  @IsOptional()
  @Type(() => Number) // Important for transforming incoming string (from form) to number
  estimatedCost?: number;

  
}