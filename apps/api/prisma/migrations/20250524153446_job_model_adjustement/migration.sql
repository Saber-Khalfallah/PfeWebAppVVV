/*
  Warnings:

  - You are about to drop the column `location` on the `service_provider_profiles` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "jobs" ADD COLUMN     "closedReason" TEXT;

-- AlterTable
ALTER TABLE "service_provider_profiles" DROP COLUMN "location";

-- AlterTable
ALTER TABLE "service_providers" ADD COLUMN     "location" TEXT;
