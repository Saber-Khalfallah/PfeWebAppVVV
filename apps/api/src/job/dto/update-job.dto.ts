import { IsString, IsNumber, IsOptional, IsUUID, IsDateString } from 'class-validator';

export class UpdateJobDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsUUID()
  @IsOptional()
  categoryId?: string;

  @IsString()
  @IsOptional()
  governorate?: string;

  @IsString()
  @IsOptional()
  governorateAr?: string;

  @IsString()
  @IsOptional()
  delegation?: string;

  @IsString()
  @IsOptional()
  delegationAr?: string;

  @IsString()
  @IsOptional()
  postalCode?: string;

  @IsNumber()
  @IsOptional()
  latitude?: number;

  @IsNumber()
  @IsOptional()
  longitude?: number;

  @IsNumber()
  @IsOptional()
  estimatedCost?: number;

  @IsDateString()
  @IsOptional()
  requestedDatetime?: string;
  
  @IsOptional()
  
  removedImages?: string[];  // Allow removedImages to be optional

  
  
}