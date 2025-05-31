import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import * as dotenv from 'dotenv'; // Add this line
import * as cookieParser from 'cookie-parser';
dotenv.config(); // Add this line

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Get config service
  const configService = app.get(ConfigService);

  // Security middleware
  app.use(helmet());

  app.use(cookieParser());
  app.enableCors({
    origin: 'http://localhost:3000', // your frontend URL
    credentials: true, // ✅ allow cookies
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strip properties not in DTO
      forbidNonWhitelisted: true, // Throw error on non-whitelisted properties
      transform: true, // Transform incoming data to DTOs
    }),
  );

  // Global exception filter
  app.useGlobalFilters(new HttpExceptionFilter());

  // API prefix
  app.setGlobalPrefix('api');

  // Get port from environment or use default
  const port = configService.get<number>('PORT') || 8000;

  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
}
bootstrap();