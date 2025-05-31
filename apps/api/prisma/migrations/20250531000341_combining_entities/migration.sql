/*
  Warnings:

  - You are about to drop the column `profileId` on the `profile_media` table. All the data in the column will be lost.
  - You are about to drop the `service_provider_profiles` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `providerId` to the `profile_media` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "profile_media" DROP CONSTRAINT "profile_media_profileId_fkey";

-- DropForeignKey
ALTER TABLE "service_provider_profiles" DROP CONSTRAINT "service_provider_profiles_providerId_fkey";

-- AlterTable
ALTER TABLE "profile_media" DROP COLUMN "profileId",
ADD COLUMN     "providerId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "service_providers" ADD COLUMN     "coverageArea" TEXT,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "experienceYears" INTEGER,
ADD COLUMN     "hourlyRate" DECIMAL(10,2),
ADD COLUMN     "performanceStats" JSONB;

-- DropTable
DROP TABLE "service_provider_profiles";

-- AddForeignKey
ALTER TABLE "profile_media" ADD CONSTRAINT "profile_media_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "service_providers"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;
