/*
  Warnings:

  - You are about to drop the column `address` on the `clients` table. All the data in the column will be lost.
  - You are about to drop the column `coverageArea` on the `service_providers` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "CoverageType" AS ENUM ('RADIUS', 'AREAS', 'CUSTOM');

-- AlterTable
ALTER TABLE "clients" DROP COLUMN "address",
ADD COLUMN     "delegation" TEXT,
ADD COLUMN     "delegationAr" TEXT,
ADD COLUMN     "governorate" TEXT,
ADD COLUMN     "governorateAr" TEXT,
ALTER COLUMN "country" SET DEFAULT 'Tunisia';

-- AlterTable
ALTER TABLE "service_providers" DROP COLUMN "coverageArea",
ADD COLUMN     "coverageRadius" DOUBLE PRECISION,
ADD COLUMN     "coverageType" "CoverageType" DEFAULT 'RADIUS';

-- CreateTable
CREATE TABLE "provider_areas" (
    "id" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "nameAr" TEXT,
    "governorate" TEXT NOT NULL,
    "governorateAr" TEXT,
    "delegation" TEXT,
    "delegationAr" TEXT,
    "postalCode" TEXT,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "distance" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "provider_areas_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "provider_areas_governorate_idx" ON "provider_areas"("governorate");

-- CreateIndex
CREATE INDEX "provider_areas_providerId_idx" ON "provider_areas"("providerId");

-- CreateIndex
CREATE INDEX "provider_areas_postalCode_idx" ON "provider_areas"("postalCode");

-- AddForeignKey
ALTER TABLE "provider_areas" ADD CONSTRAINT "provider_areas_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "service_providers"("userId") ON DELETE CASCADE ON UPDATE CASCADE;
