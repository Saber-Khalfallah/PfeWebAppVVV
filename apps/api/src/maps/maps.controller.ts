import { Controller, Get, Post, Body, Query, ParseFloatPipe } from '@nestjs/common';
import { Coordinates, MapsService } from './maps.service';

@Controller('maps')
export class MapsController {
  constructor(private readonly mapsService: MapsService) {}

  @Get('config')
  getMapConfig() {
    return this.mapsService.getMapConfig();
  }

  @Post('geocode')
  async geocodeAddress(@Body('address') address: string) {
    return this.mapsService.geocodeAddress(address);
  }

  @Get('reverse-geocode')
  async reverseGeocode(
    @Query('lat', ParseFloatPipe) lat: number,
    @Query('lng', ParseFloatPipe) lng: number
  ) {
    return this.mapsService.reverseGeocode(lat, lng);
  }

  @Post('distance')
  async calculateDistance(
    @Body('origin') origin: Coordinates,
    @Body('destination') destination: Coordinates
  ) {
    return this.mapsService.calculateDistance(origin, destination);
  }
}