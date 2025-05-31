import { IsString, IsOptional, IsNotEmpty, MaxLength } from 'class-validator';

export class CreateServiceCategoryDto {
  
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  
  @IsString()
  @IsOptional()
  @MaxLength(500)
  description?: string;
}