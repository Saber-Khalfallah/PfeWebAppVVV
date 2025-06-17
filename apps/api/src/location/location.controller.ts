import { Controller, Get, Post, Body, Param, Query, ParseIntPipe, ParseFloatPipe } from '@nestjs/common';
import { DelegationData, LocationResult, LocationService } from './location.service';
import { UpdateCoverageDto } from './dto/update-coverage.dto';
import { SearchLocationDto } from './dto/search-location.dto';

@Controller('location')
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  @Get('governorates')
  getAllGovernorates() {
    return this.locationService.getAllGovernorates();
  }

  @Get('governorates/:governorate/delegations')
  getDelegationsByGovernorate(@Param('governorate') governorate: string) {
    return this.locationService.getDelegationsByGovernorate(governorate);
  }

  @Get('delegations')
  async getAllDelegations(): Promise<DelegationData[]> {
        return this.locationService.getAllDelegations();
    }

  @Get('postal/:code')
  getLocationByPostalCode(@Param('code') code: string) {
    return this.locationService.findLocationByPostalCode(code);
  }

  @Get('nearby')
  async getNearbyLocations(
    @Query('lat', ParseFloatPipe) lat: number,
    @Query('lng', ParseFloatPipe) lng: number,
    @Query('radius', ParseFloatPipe) radius: number = 10
  ): Promise<LocationResult[]> {
    return this.locationService.findNearbyLocations(lat, lng, radius);
  }

  @Post('providers/:id/coverage')
  updateProviderCoverage(
    @Param('id') providerId: string,
    @Body() updateCoverageDto: UpdateCoverageDto
  ) {
    return this.locationService.updateProviderCoverage(
      providerId, 
      updateCoverageDto.type, 
      updateCoverageDto
    );
  }

  @Get('providers/:id/coverage')
  getProviderCoverage(@Param('id') providerId: string) {
    return this.locationService.getProviderCoverage(providerId);
  }

  @Get('providers/search')
  searchProviders(@Query() searchDto: SearchLocationDto) {
    return this.locationService.getProvidersInArea(
      searchDto.lat!,
      searchDto.lng!,
      searchDto.serviceCategory
    );
  }
}