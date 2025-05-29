/*
  Warnings:

  - You are about to drop the `Services` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_NoSchedulingServiceToServices` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_SchedulingServiceToServices` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[id]` on the table `Barbershop` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id]` on the table `NoSchedulingService` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id]` on the table `SchedulingService` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[barbershopId]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `date` to the `NoSchedulingService` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dateHour` to the `SchedulingService` table without a default value. This is not possible if the table is not empty.
  - Added the required column `barbershopId` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Services" DROP CONSTRAINT "Services_barbershopId_fkey";

-- DropForeignKey
ALTER TABLE "_NoSchedulingServiceToServices" DROP CONSTRAINT "_NoSchedulingServiceToServices_A_fkey";

-- DropForeignKey
ALTER TABLE "_NoSchedulingServiceToServices" DROP CONSTRAINT "_NoSchedulingServiceToServices_B_fkey";

-- DropForeignKey
ALTER TABLE "_SchedulingServiceToServices" DROP CONSTRAINT "_SchedulingServiceToServices_A_fkey";

-- DropForeignKey
ALTER TABLE "_SchedulingServiceToServices" DROP CONSTRAINT "_SchedulingServiceToServices_B_fkey";

-- AlterTable
ALTER TABLE "NoSchedulingService" ADD COLUMN     "date" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "SchedulingService" ADD COLUMN     "dateHour" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "barbershopId" TEXT NOT NULL,
ALTER COLUMN "birth" DROP NOT NULL;

-- DropTable
DROP TABLE "Services";

-- DropTable
DROP TABLE "_NoSchedulingServiceToServices";

-- DropTable
DROP TABLE "_SchedulingServiceToServices";

-- CreateTable
CREATE TABLE "BarberServices" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" MONEY NOT NULL,
    "barbershopId" TEXT NOT NULL,

    CONSTRAINT "BarberServices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_BarberServicesToSchedulingService" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_BarberServicesToSchedulingService_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_BarberServicesToNoSchedulingService" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_BarberServicesToNoSchedulingService_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "BarberServices_id_key" ON "BarberServices"("id");

-- CreateIndex
CREATE INDEX "_BarberServicesToSchedulingService_B_index" ON "_BarberServicesToSchedulingService"("B");

-- CreateIndex
CREATE INDEX "_BarberServicesToNoSchedulingService_B_index" ON "_BarberServicesToNoSchedulingService"("B");

-- CreateIndex
CREATE UNIQUE INDEX "Barbershop_id_key" ON "Barbershop"("id");

-- CreateIndex
CREATE UNIQUE INDEX "NoSchedulingService_id_key" ON "NoSchedulingService"("id");

-- CreateIndex
CREATE UNIQUE INDEX "SchedulingService_id_key" ON "SchedulingService"("id");

-- CreateIndex
CREATE UNIQUE INDEX "User_id_key" ON "User"("id");

-- CreateIndex
CREATE UNIQUE INDEX "User_barbershopId_key" ON "User"("barbershopId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_barbershopId_fkey" FOREIGN KEY ("barbershopId") REFERENCES "Barbershop"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BarberServices" ADD CONSTRAINT "BarberServices_barbershopId_fkey" FOREIGN KEY ("barbershopId") REFERENCES "Barbershop"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BarberServicesToSchedulingService" ADD CONSTRAINT "_BarberServicesToSchedulingService_A_fkey" FOREIGN KEY ("A") REFERENCES "BarberServices"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BarberServicesToSchedulingService" ADD CONSTRAINT "_BarberServicesToSchedulingService_B_fkey" FOREIGN KEY ("B") REFERENCES "SchedulingService"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BarberServicesToNoSchedulingService" ADD CONSTRAINT "_BarberServicesToNoSchedulingService_A_fkey" FOREIGN KEY ("A") REFERENCES "BarberServices"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BarberServicesToNoSchedulingService" ADD CONSTRAINT "_BarberServicesToNoSchedulingService_B_fkey" FOREIGN KEY ("B") REFERENCES "NoSchedulingService"("id") ON DELETE CASCADE ON UPDATE CASCADE;
