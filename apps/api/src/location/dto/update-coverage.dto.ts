import { IsEnum, IsOptional, IsNumber, IsArray, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CoverageType } from 'generated/prisma';

class BaseLocationDto {
  @IsNumber()
  lat: number;

  @IsNumber()
  lng: number;
}

export class UpdateCoverageDto {
  @IsEnum(CoverageType)
  type: CoverageType;

  @IsOptional()
  @IsNumber()
  radius?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  areas?: string[];

  @IsOptional()
  @ValidateNested()
  @Type(() => BaseLocationDto)
  baseLocation?: BaseLocationDto;
}