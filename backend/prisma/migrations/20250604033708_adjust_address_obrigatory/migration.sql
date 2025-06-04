/*
  Warnings:

  - Made the column `addressId` on table `Barbershop` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Barbershop" ALTER COLUMN "addressId" SET NOT NULL;
