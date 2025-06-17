import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { readFileSync } from 'fs';
import { join } from 'path';
import * as turf from '@turf/turf';
import { CoverageType } from 'generated/prisma';

export interface TunisiaDelegation {
    Name: string;
    NameAr: string;
    Value: string;
    PostalCode: string;
    Latitude: number;
    Longitude: number;
}
export interface LocationResult {
    governorate: string;
    governorateAr: string;
    delegation: string;
    delegationAr: string;
    postalCode: string;
    latitude: number;
    longitude: number;
    distance: number;
}
export interface DelegationData {
    governorate: string;
    governorateAr: string;
    delegation: string;
    delegationAr: string;
    postalCode: string;
    latitude: number;
    longitude: number;
}
export interface TunisiaGovernorate {
    Name: string;
    NameAr: string;
    Value: string;
    Delegations: TunisiaDelegation[];
}
interface LocationDetails {
    providerId: string;
    name: string;
    nameAr: string;
    governorate: string;
    governorateAr: string;
    delegation: string;
    delegationAr: string;
    postalCode: string;
    latitude: number;
    longitude: number;
    distance: number | null;
}
@Injectable()
export class LocationService {
    private geodata: TunisiaGovernorate[];

    constructor(private prisma: PrismaService) {
        this.loadGeodata();
    }

    private loadGeodata() {
        try {
            const dataPath = join(process.cwd(), 'src/data/tunisia-geodata.json');
            this.geodata = JSON.parse(readFileSync(dataPath, 'utf8'));
        } catch (error) {
            console.error('Failed to load Tunisia geodata:', error);
            this.geodata = [];
        }
    }

    getAllGovernorates() {
        return this.geodata.map(gov => ({
            name: gov.Name,
            nameAr: gov.NameAr,
            value: gov.Value
        }));
    }

    getDelegationsByGovernorate(governorate: string) {
        this.geodata.forEach(g => {
            g.Value = g.Value.toLowerCase();
            g.Name = g.Name.toLowerCase();
        });
        const gov = this.geodata.find(g => g.Value === governorate || g.Name === governorate);
        console.log('Governorate:', governorate, 'Found:', gov);
        console.log("geodata: ", this.geodata)
        if (!gov) return [];

        return gov.Delegations.map(del => ({
            name: del.Name,
            nameAr: del.NameAr,
            value: del.Value,
            postalCode: del.PostalCode,
            latitude: del.Latitude,
            longitude: del.Longitude
        }));
    }

    findLocationByPostalCode(postalCode: string) {
        for (const gov of this.geodata) {
            const delegation = gov.Delegations.find(del => del.PostalCode === postalCode);
            if (delegation) {
                return {
                    governorate: gov.Name,
                    governorateAr: gov.NameAr,
                    delegation: delegation.Name,
                    delegationAr: delegation.NameAr,
                    postalCode: delegation.PostalCode,
                    latitude: delegation.Latitude,
                    longitude: delegation.Longitude
                };
            }
        }
        return null;
    }

    async findNearbyLocations(lat: number, lng: number, radiusKm: number): Promise<LocationResult[]> {
        const center = turf.point([lng, lat]);

        const results: LocationResult[] = this.geodata.flatMap(gov =>
            gov.Delegations
                .map(del => {
                    const point = turf.point([del.Longitude, del.Latitude]);
                    const distance = turf.distance(center, point, { units: 'kilometers' });

                    return {
                        governorate: gov.Name,
                        governorateAr: gov.NameAr,
                        delegation: del.Name,
                        delegationAr: del.NameAr,
                        postalCode: del.PostalCode,
                        latitude: del.Latitude,
                        longitude: del.Longitude,
                        distance: Math.round(distance * 100) / 100
                    };
                })
                .filter(result => result.distance <= radiusKm)
        );

        return results.sort((a, b) => a.distance - b.distance);
    }

    calculateDistance(point1: [number, number], point2: [number, number]): number {
        const from = turf.point(point1);
        const to = turf.point(point2);
        return turf.distance(from, to, { units: 'kilometers' });
    }

    async updateProviderCoverage(
        providerId: string,
        coverageType: CoverageType,
        data: {
            radius?: number;
            areas?: string[];
            baseLocation?: { lat: number; lng: number };
        }
    ) {
        // Update provider coverage type
        await this.prisma.serviceProvider.update({
            where: { userId: providerId },
            data: {
                coverageType,
                coverageRadius: data.radius
            }
        });

        // Clear existing areas
        await this.prisma.providerArea.deleteMany({
            where: { providerId }
        });

        if (coverageType === 'AREAS' && data.areas) {
            // Replace the nested for loops with flatMap
            const areasToAdd: LocationDetails[] = data.areas.flatMap(governorateValue => {
                const gov = this.geodata.find(g => g.Value === governorateValue);
                if (!gov) return [];

                return gov.Delegations.map(delegation => ({
                    providerId,
                    name: delegation.Name,
                    nameAr: delegation.NameAr,
                    governorate: gov.Name,
                    governorateAr: gov.NameAr,
                    delegation: delegation.Value,
                    delegationAr: delegation.NameAr,
                    postalCode: delegation.PostalCode,
                    latitude: delegation.Latitude,
                    longitude: delegation.Longitude,
                    distance: data.baseLocation
                        ? this.calculateDistance(
                            [data.baseLocation.lng, data.baseLocation.lat],
                            [delegation.Longitude, delegation.Latitude]
                        )
                        : null
                }));
            });

            if (areasToAdd.length > 0) {
                await this.prisma.providerArea.createMany({
                    data: areasToAdd
                });
            }
        }

        return { success: true };
    }

    async getProvidersInArea(lat: number, lng: number, serviceCategory?: string) {
        const providers = await this.prisma.serviceProvider.findMany({
            where: {
                isValidated: true,
                ...(serviceCategory && {
                    specialties: {
                        some: {
                            category: { name: serviceCategory }
                        }
                    }
                })
            },
            include: {
                providerAreas: true,
                specialties: {
                    include: { category: true }
                },
                user: {
                    select: {
                        email: true,
                        avatarUrl: true
                    }
                }
            }
        });

        return Promise.all(providers.map(async provider => {
            if (provider.coverageType === 'RADIUS' && provider.coverageRadius) {
                const nearbyLocations = await this.findNearbyLocations(
                    lat, lng, provider.coverageRadius
                );
                return nearbyLocations.length > 0;
            }

            if (provider.coverageType === 'AREAS') {
                return provider.providerAreas.some(area => {
                    if (!area.latitude || !area.longitude) return false;
                    const distance = this.calculateDistance(
                        [lng, lat],
                        [area.longitude, area.latitude]
                    );
                    return distance <= 5;
                });
            }

            return false;
        })).then(results => providers.filter((_, index) => results[index]));
    }

    async getProviderCoverage(providerId: string) {
        const provider = await this.prisma.serviceProvider.findUnique({
            where: { userId: providerId },
            include: {
                providerAreas: true
            }
        });

        return {
            coverageType: provider?.coverageType,
            coverageRadius: provider?.coverageRadius,
            areas: provider?.providerAreas || []
        };
    }

    async getAllDelegations(): Promise<DelegationData[]> {
        return this.geodata.flatMap(gov =>
            gov.Delegations.map(del => ({
                governorate: gov.Name,
                governorateAr: gov.NameAr,
                delegation: del.Name,
                delegationAr: del.NameAr,
                postalCode: del.PostalCode,
                latitude: del.Latitude,
                longitude: del.Longitude
            }))
        );
    }
}