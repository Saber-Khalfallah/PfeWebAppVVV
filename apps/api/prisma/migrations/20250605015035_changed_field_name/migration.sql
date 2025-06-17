/*
  Warnings:

  - You are about to drop the column `zipCode` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "zipCode",
ADD COLUMN     "postalCode" TEXT;
