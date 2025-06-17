import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import {  AzureStorageService} from './azure-storage/azure-storage.service';
import { AzureStorageModule } from './azure-storage/azure-storage.module';
import { JobModule } from './job/job.module';
import { ServiceCategoryModule } from './service-category/service-category.module';
import { ServiceProvidersController } from './service-providers/service-providers.controller';
import { ServiceProvidersModule } from './service-providers/service-providers.module';
import { LocationService } from './location/location.service';
import { MapsService } from './maps/maps.service';
import { LocationController } from './location/location.controller';
import { MapsController } from './maps/maps.controller';
import { LocationModule } from './location/location.module';
import { MapsModule } from './maps/maps.module';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
  }),
    AuthModule, UsersModule, PrismaModule, AzureStorageModule, JobModule, ServiceCategoryModule, ServiceProvidersModule, LocationModule, MapsModule],
  controllers: [AppController, LocationController, MapsController],
  providers: [AppService, AzureStorageService, LocationService, MapsService],
})
export class AppModule {}
