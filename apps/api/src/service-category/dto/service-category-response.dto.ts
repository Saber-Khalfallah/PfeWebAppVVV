
export class ServiceCategoryResponseDto {

    id: string;


    name: string;


    description?: string;


    createdAt: Date;


    updatedAt: Date;

    _count?: {
        jobs: number;
        providers: number;
    };
}