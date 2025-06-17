/*
  Warnings:

  - You are about to drop the column `city` on the `clients` table. All the data in the column will be lost.
  - You are about to drop the column `country` on the `clients` table. All the data in the column will be lost.
  - You are about to drop the column `delegation` on the `clients` table. All the data in the column will be lost.
  - You are about to drop the column `delegationAr` on the `clients` table. All the data in the column will be lost.
  - You are about to drop the column `governorate` on the `clients` table. All the data in the column will be lost.
  - You are about to drop the column `governorateAr` on the `clients` table. All the data in the column will be lost.
  - You are about to drop the column `latitude` on the `clients` table. All the data in the column will be lost.
  - You are about to drop the column `longitude` on the `clients` table. All the data in the column will be lost.
  - You are about to drop the column `placeId` on the `clients` table. All the data in the column will be lost.
  - You are about to drop the column `state` on the `clients` table. All the data in the column will be lost.
  - You are about to drop the column `zipCode` on the `clients` table. All the data in the column will be lost.
  - You are about to drop the column `city` on the `service_providers` table. All the data in the column will be lost.
  - You are about to drop the column `country` on the `service_providers` table. All the data in the column will be lost.
  - You are about to drop the column `delegation` on the `service_providers` table. All the data in the column will be lost.
  - You are about to drop the column `delegationAr` on the `service_providers` table. All the data in the column will be lost.
  - You are about to drop the column `governorate` on the `service_providers` table. All the data in the column will be lost.
  - You are about to drop the column `governorateAr` on the `service_providers` table. All the data in the column will be lost.
  - You are about to drop the column `latitude` on the `service_providers` table. All the data in the column will be lost.
  - You are about to drop the column `longitude` on the `service_providers` table. All the data in the column will be lost.
  - You are about to drop the column `placeId` on the `service_providers` table. All the data in the column will be lost.
  - You are about to drop the column `state` on the `service_providers` table. All the data in the column will be lost.
  - You are about to drop the column `zipCode` on the `service_providers` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "clients" DROP COLUMN "city",
DROP COLUMN "country",
DROP COLUMN "delegation",
DROP COLUMN "delegationAr",
DROP COLUMN "governorate",
DROP COLUMN "governorateAr",
DROP COLUMN "latitude",
DROP COLUMN "longitude",
DROP COLUMN "placeId",
DROP COLUMN "state",
DROP COLUMN "zipCode";

-- AlterTable
ALTER TABLE "service_providers" DROP COLUMN "city",
DROP COLUMN "country",
DROP COLUMN "delegation",
DROP COLUMN "delegationAr",
DROP COLUMN "governorate",
DROP COLUMN "governorateAr",
DROP COLUMN "latitude",
DROP COLUMN "longitude",
DROP COLUMN "placeId",
DROP COLUMN "state",
DROP COLUMN "zipCode";

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "city" TEXT,
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
