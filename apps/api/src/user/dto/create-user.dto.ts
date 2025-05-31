import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
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


}