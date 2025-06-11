/*
  Warnings:

  - You are about to drop the column `imageUrl` on the `Barbershop` table. All the data in the column will be lost.
  - You are about to drop the column `timeClose` on the `Barbershop` table. All the data in the column will be lost.
  - You are about to drop the column `timeOpen` on the `Barbershop` table. All the data in the column will be lost.
  - You are about to drop the column `barbershopId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `birth` on the `User` table. All the data in the column will be lost.
  - The `role` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `AddressBarbershop` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `BarberServices` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `NoSchedulingService` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SchedulingService` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_BarberServicesToNoSchedulingService` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_BarberServicesToSchedulingService` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `updatedAt` to the `Barbershop` table without a default value. This is not possible if the table is not empty.
  - Added the required column `birthDate` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "SystemRole" AS ENUM ('ADMIN', 'BARBER', 'CLIENT');

-- CreateEnum
CREATE TYPE "BarbershopRole" AS ENUM ('OWNER', 'BARBER');

-- CreateEnum
CREATE TYPE "ServiceCategory" AS ENUM ('HAIRCUT', 'BEARD', 'FINISHING', 'COLORING', 'COMBOS', 'OTHER');

-- DropForeignKey
ALTER TABLE "BarberServices" DROP CONSTRAINT "BarberServices_barbershopId_fkey";

-- DropForeignKey
ALTER TABLE "Barbershop" DROP CONSTRAINT "Barbershop_addressId_fkey";

-- DropForeignKey
ALTER TABLE "NoSchedulingService" DROP CONSTRAINT "NoSchedulingService_barberId_fkey";

-- DropForeignKey
ALTER TABLE "NoSchedulingService" DROP CONSTRAINT "NoSchedulingService_barbershopId_fkey";

-- DropForeignKey
ALTER TABLE "NoSchedulingService" DROP CONSTRAINT "NoSchedulingService_clientId_fkey";

-- DropForeignKey
ALTER TABLE "SchedulingService" DROP CONSTRAINT "SchedulingService_barberId_fkey";

-- DropForeignKey
ALTER TABLE "SchedulingService" DROP CONSTRAINT "SchedulingService_barbershopId_fkey";

-- DropForeignKey
ALTER TABLE "SchedulingService" DROP CONSTRAINT "SchedulingService_clientId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_barbershopId_fkey";

-- DropForeignKey
ALTER TABLE "_BarberServicesToNoSchedulingService" DROP CONSTRAINT "_BarberServicesToNoSchedulingService_A_fkey";

-- DropForeignKey
ALTER TABLE "_BarberServicesToNoSchedulingService" DROP CONSTRAINT "_BarberServicesToNoSchedulingService_B_fkey";

-- DropForeignKey
ALTER TABLE "_BarberServicesToSchedulingService" DROP CONSTRAINT "_BarberServicesToSchedulingService_A_fkey";

-- DropForeignKey
ALTER TABLE "_BarberServicesToSchedulingService" DROP CONSTRAINT "_BarberServicesToSchedulingService_B_fkey";

-- DropIndex
DROP INDEX "Barbershop_id_key";

-- DropIndex
DROP INDEX "User_id_key";

-- AlterTable
ALTER TABLE "Barbershop" DROP COLUMN "imageUrl",
DROP COLUMN "timeClose",
DROP COLUMN "timeOpen",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "barbershopId",
DROP COLUMN "birth",
ADD COLUMN     "birthDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
DROP COLUMN "role",
ADD COLUMN     "role" "SystemRole" NOT NULL DEFAULT 'CLIENT';

-- DropTable
DROP TABLE "AddressBarbershop";

-- DropTable
DROP TABLE "BarberServices";

-- DropTable
DROP TABLE "NoSchedulingService";

-- DropTable
DROP TABLE "SchedulingService";

-- DropTable
DROP TABLE "_BarberServicesToNoSchedulingService";

-- DropTable
DROP TABLE "_BarberServicesToSchedulingService";

-- DropEnum
DROP TYPE "Role";

-- CreateTable
CREATE TABLE "BarbershopEmployee" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "barbershopId" TEXT NOT NULL,
    "role" "BarbershopRole" NOT NULL DEFAULT 'BARBER',

    CONSTRAINT "BarbershopEmployee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Address" (
    "id" TEXT NOT NULL,
    "street" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "zipCode" TEXT NOT NULL,
    "country" TEXT NOT NULL,

    CONSTRAINT "Address_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Service" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "category" "ServiceCategory" NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "barbershopId" TEXT NOT NULL,

    CONSTRAINT "Service_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Booking" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "barbershopId" TEXT NOT NULL,
    "serviceId" TEXT NOT NULL,
    "employeeId" TEXT,

    CONSTRAINT "Booking_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BarbershopEmployee_userId_barbershopId_key" ON "BarbershopEmployee"("userId", "barbershopId");

-- AddForeignKey
ALTER TABLE "Barbershop" ADD CONSTRAINT "Barbershop_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "Address"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BarbershopEmployee" ADD CONSTRAINT "BarbershopEmployee_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BarbershopEmployee" ADD CONSTRAINT "BarbershopEmployee_barbershopId_fkey" FOREIGN KEY ("barbershopId") REFERENCES "Barbershop"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Service" ADD CONSTRAINT "Service_barbershopId_fkey" FOREIGN KEY ("barbershopId") REFERENCES "Barbershop"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_barbershopId_fkey" FOREIGN KEY ("barbershopId") REFERENCES "Barbershop"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "BarbershopEmployee"("id") ON DELETE SET NULL ON UPDATE CASCADE;
