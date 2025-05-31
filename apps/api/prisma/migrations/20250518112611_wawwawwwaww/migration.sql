/*
  Warnings:

  - You are about to drop the column `firsName` on the `administrators` table. All the data in the column will be lost.
  - Added the required column `firstName` to the `administrators` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "administrators" DROP COLUMN "firsName",
ADD COLUMN     "firstName" TEXT NOT NULL;
