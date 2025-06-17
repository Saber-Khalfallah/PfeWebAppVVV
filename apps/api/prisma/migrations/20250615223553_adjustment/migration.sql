/*
  Warnings:

  - You are about to drop the column `location` on the `jobs` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "jobs" DROP COLUMN "location",
ADD COLUMN     "country" TEXT DEFAULT 'Tunisia',
ADD COLUMN     "delegation" TEXT,
ADD COLUMN     "delegationAr" TEXT,
ADD COLUMN     "governorate" TEXT,
ADD COLUMN     "governorateAr" TEXT,
ADD COLUMN     "latitude" DOUBLE PRECISION,
ADD COLUMN     "longitude" DOUBLE PRECISION,
ADD COLUMN     "postalCode" TEXT;
