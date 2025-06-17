import { IsEmail, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, MinLength } from 'class-validator';
import { Role } from '../../auth/enums/role.enum';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string;

  @IsEnum(Role)
  @IsNotEmpty()
  role: Role;

  // Common fields for all roles
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;
  
  @IsString()
  @IsOptional()
  contactInfo?: string;

  // Additional fields based on role
  @IsString()
  @IsOptional()
  companyName?: string; // For SERVICE_PROVIDER

  @IsString()
  @IsOptional()
  location?: string; // For CLIENT

  @IsString()
  @IsOptional()
  placeId?: string;

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
  city?: string;

  @IsString()
  @IsOptional()
  state?: string;

  @IsString()
  @IsOptional()
  country?: string;

  @IsString()
  @IsOptional()
  postalCode?: string;

  @IsNumber()
  @IsOptional()
  latitude?: number;

  @IsNumber()
  @IsOptional()
  longitude?: number;
}