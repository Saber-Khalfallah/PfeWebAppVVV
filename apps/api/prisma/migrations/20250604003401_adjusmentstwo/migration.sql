-- AlterTable
ALTER TABLE "clients" ADD COLUMN     "location" TEXT;

-- AlterTable
ALTER TABLE "service_providers" ADD COLUMN     "city" TEXT,
ADD COLUMN     "country" TEXT DEFAULT 'Tunisia',
ADD COLUMN     "delegation" TEXT,
ADD COLUMN     "delegationAr" TEXT,
ADD COLUMN     "governorate" TEXT,
ADD COLUMN     "governorateAr" TEXT,
ADD COLUMN     "latitude" DOUBLE PRECISION,
ADD COLUMN     "longitude" DOUBLE PRECISION,
ADD COLUMN     "placeId" TEXT,
ADD COLUMN     "state" TEXT,
ADD COLUMN     "zipCode" TEXT;
