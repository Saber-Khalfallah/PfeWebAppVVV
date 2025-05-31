/*
  Warnings:

  - You are about to drop the column `name` on the `administrators` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `clients` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `service_providers` table. All the data in the column will be lost.
  - Added the required column `firsName` to the `administrators` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastName` to the `administrators` table without a default value. This is not possible if the table is not empty.
  - Added the required column `firstName` to the `clients` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastName` to the `clients` table without a default value. This is not possible if the table is not empty.
  - Added the required column `firstName` to the `service_providers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastName` to the `service_providers` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "administrators" DROP COLUMN "name",
ADD COLUMN     "firsName" TEXT NOT NULL,
ADD COLUMN     "lastName" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "clients" DROP COLUMN "name",
ADD COLUMN     "firstName" TEXT NOT NULL,
ADD COLUMN     "lastName" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "service_providers" DROP COLUMN "name",
ADD COLUMN     "firstName" TEXT NOT NULL,
ADD COLUMN     "lastName" TEXT NOT NULL;
