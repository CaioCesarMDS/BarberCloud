/*
  Warnings:

  - Added the required column `timeClose` to the `Barbershop` table without a default value. This is not possible if the table is not empty.
  - Added the required column `timeOpen` to the `Barbershop` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Barbershop" ADD COLUMN     "timeClose" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "timeOpen" TIMESTAMP(3) NOT NULL;
