import { Injectable } from '@nestjs/common';
import axios from 'axios';
 export interface Coordinates {
  lat: number;
  lng: number;
}
@Injectable()
export class MapsService {
    private nominatimBaseUrl = 'https://nominatim.openstreetmap.org';
    private tunisiaBounds = {
        north: 37.3499,
        south: 30.2407,
        east: 11.5998,
        west: 7.5244
    };

    async geocodeAddress(address: string) {
        try {
            const response = await axios.get(`${this.nominatimBaseUrl}/search`, {
                params: {
                    q: `${address}, Tunisia`,
                    format: 'json',
                    limit: 1,
                    countrycodes: 'tn',
                    bounded: 1,
                    viewbox: `${this.tunisiaBounds.west},${this.tunisiaBounds.north},${this.tunisiaBounds.east},${this.tunisiaBounds.south}`
                },
                headers: {
                    'User-Agent': 'YourApp/1.0' // Required by Nominatim
                }
            });

            if (!response.data.length) {
                throw new Error('No results found');
            }

            const result = response.data[0];
            console.log('Geocoding result:', result);
            return {
                lat: parseFloat(result.lat),
                lng: parseFloat(result.lon),
                displayName: result.display_name
            };
        } catch (error) {
            console.error('Geocoding error:', error);
            throw new Error(`Geocoding failed: ${error.message}`);
        }
    }

    async reverseGeocode(lat: number, lng: number) {
        try {
            const response = await axios.get(`${this.nominatimBaseUrl}/reverse`, {
                params: {
                    lat,
                    lon: lng,
                    format: 'json',
                    'accept-language': 'fr'
                },
                headers: {
                    'User-Agent': 'YourApp/1.0'
                }
            });

            return {
                address: response.data.display_name,
                components: {
                    street: response.data.address.road,
                    city: response.data.address.city || response.data.address.town,
                    postalCode: response.data.address.postcode,
                    country: response.data.address.country
                }
            };
        } catch (error) {
            throw new Error(`Reverse geocoding failed: ${error.message}`);
        }
    }

    async calculateDistance(
        point1: Coordinates,
        point2: Coordinates
    ) {
        try {
            const response = await axios.get(
                `https://router.project-osrm.org/route/v1/driving/${point1.lng},${point1.lat};${point2.lng},${point2.lat}`,
                {
                    params: {
                        overview: 'false',
                        alternatives: false
                    }
                }
            );

            if (!response.data.routes || !response.data.routes.length) {
                throw new Error('No route found between the points');
            }

            const route = response.data.routes[0];
            return {
                distance: {
                    text: `${(route.distance / 1000).toFixed(1)} km`,
                    value: route.distance
                },
                duration: {
                    text: this.formatDuration(route.duration),
                    value: route.duration
                }
            };
        } catch (error) {
            console.error('Distance calculation error:', error);
            throw new Error(`Distance calculation failed: ${error.message}`);
        }
    }

    private formatDuration(seconds: number): string {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);

        if (hours > 0) {
            return `${hours}h ${minutes}min`;
        }
        return `${minutes} min`;
    }

    getMapConfig() {
        return {
            center: { lat: 33.8869, lng: 9.5375 }, // Center of Tunisia
            zoom: 7,
            bounds: this.tunisiaBounds,
            tileLayer: {
                url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                attribution: '© OpenStreetMap contributors'
            }
        };
    }
}