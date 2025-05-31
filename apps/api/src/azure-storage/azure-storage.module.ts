// src/azure-storage/azure-storage.module.ts
import { Module } from '@nestjs/common';
import { AzureStorageService } from './azure-storage.service';

@Module({
  providers: [AzureStorageService],
  exports: [AzureStorageService], // Make it available to other modules
})
export class AzureStorageModule {}