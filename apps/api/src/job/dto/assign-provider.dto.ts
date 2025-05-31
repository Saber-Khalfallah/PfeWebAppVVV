import { IsUUID, IsNotEmpty } from 'class-validator';

export class AssignProviderDto {
  @IsUUID()
  @IsNotEmpty()
  providerId: string;
}