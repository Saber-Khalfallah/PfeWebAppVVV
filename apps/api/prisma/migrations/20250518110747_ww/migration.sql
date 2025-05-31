/*
  Warnings:

  - Added the required column `name` to the `service_providers` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "service_providers" ADD COLUMN     "name" TEXT NOT NULL;
