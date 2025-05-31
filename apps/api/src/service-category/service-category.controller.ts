import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
  DefaultValuePipe,
  ParseBoolPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ServiceCategoryService } from './service-category.service';
import { CreateServiceCategoryDto } from './dto/create-service-category.dto';
import { UpdateServiceCategoryDto } from './dto/update-service-category.dto';

@Controller('service-categories')
export class ServiceCategoryController {
  constructor(private readonly serviceCategoryService: ServiceCategoryService) {}

  @Post()
  create(@Body() createServiceCategoryDto: CreateServiceCategoryDto) {
    return this.serviceCategoryService.create(createServiceCategoryDto);
  }

  @Get()
  findAll(
    @Query('includeStats', new DefaultValuePipe(false), ParseBoolPipe)
    includeStats: boolean,
  ) {
    return this.serviceCategoryService.findAll(includeStats);
  }

  @Get(':id')
  findOne(
    @Param('id') id: string,
    @Query('includeStats', new DefaultValuePipe(false), ParseBoolPipe)
    includeStats: boolean,
  ) {
    return this.serviceCategoryService.findOne(id, includeStats);
  }

  @Get(':id/jobs')
  getJobsByCategory(
    @Param('id') id: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    return this.serviceCategoryService.getJobsByCategory(id, page, limit);
  }

  @Get(':id/providers')
  getProvidersByCategory(
    @Param('id') id: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    return this.serviceCategoryService.getProvidersByCategory(id, page, limit);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateServiceCategoryDto: UpdateServiceCategoryDto,
  ) {
    return this.serviceCategoryService.update(id, updateServiceCategoryDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    await this.serviceCategoryService.remove(id);
  }
}