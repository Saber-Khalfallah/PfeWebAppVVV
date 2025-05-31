import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateServiceProviderDto } from './dto/create-service-provider.dto';
import { UpdateServiceProviderDto } from './dto/update-service-provider.dto';
import { PrismaService } from 'src/prisma/prisma.service';
@Injectable()
export class ServiceProvidersService {
    constructor(private prisma: PrismaService) {}

  create(createServiceProviderDto: CreateServiceProviderDto) {
    return 'This action adds a new serviceProvider';
  }

  findAll() {
    return `This action returns all serviceProviders`;
  }

    async findOne(userId: string) {
    const provider = await this.prisma.serviceProvider.findUnique({
      where: { userId },
      include: { user: true,ratings:true , specialties : {include : {category : true}} 
      
        , media: true },
    });
    if (!provider) throw new NotFoundException(`Provider ${userId} not found`);
    return provider;
  }

  update(id: number, updateServiceProviderDto: UpdateServiceProviderDto) {
    return `This action updates a #${id} serviceProvider`;
  }

  remove(id: number) {
    return `This action removes a #${id} serviceProvider`;
  }
}
