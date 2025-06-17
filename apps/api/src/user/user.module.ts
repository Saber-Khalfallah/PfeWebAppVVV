import { Module } from '@nestjs/common';
import { UsersService } from './user.service';
import { PrismaModule } from '../prisma/prisma.module';
import { AzureStorageModule } from 'src/azure-storage/azure-storage.module';
import { UserController } from './user.controller';

@Module({
  imports: [PrismaModule,AzureStorageModule],
  providers: [UsersService],
  controllers: [UserController],
  exports: [UsersService],
})
export class UsersModule {}