import { IsOptional, IsString, IsNumber } from 'class-validator';

export class SearchLocationDto {
  @IsOptional()
  @IsString()
  governorate?: string;

  @IsOptional()
  @IsString()
  postalCode?: string;

  @IsOptional()
  @IsNumber()
  lat?: number;

  @IsOptional()
  @IsNumber()
  lng?: number;

  @IsOptional()
  @IsNumber()
  radius?: number;

  @IsOptional()
  @IsString()
  serviceCategory?: string;
}