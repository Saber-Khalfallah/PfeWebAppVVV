// src/auth/dto/google-register.dto.ts
import { IsEmail, IsString, IsOptional, IsEnum } from 'class-validator';
import { Role } from '../enums/role.enum'

export class GoogleRegisterDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  avatarUrl?: string; // This will store the URL from Google's profile

  // If Google provides a role or you default it for OAuth users
  @IsEnum(Role)
  @IsOptional()
  role?: Role; // e.g., default to CLIENT for new Google users

  // Add any other fields you expect from Google, e.g., googleId
  @IsString()
  googleId: string;
}