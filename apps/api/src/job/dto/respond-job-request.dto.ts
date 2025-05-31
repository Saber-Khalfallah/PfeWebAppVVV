import { IsEnum } from 'class-validator';
import { RequestStatus } from 'generated/prisma'; // Adjust the import path as needed

export class RespondJobRequestDto {
  @IsEnum(RequestStatus)
  status: RequestStatus;
}