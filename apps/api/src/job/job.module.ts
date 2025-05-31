import { Module } from '@nestjs/common';
import { JobService } from './job.service';
import { JobController } from './job.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AzureStorageModule } from 'src/azure-storage/azure-storage.module';

@Module({
  imports: [PrismaModule,AzureStorageModule],
  controllers: [JobController],
  providers: [JobService]
})
export class JobModule {}
