/*
  Warnings:

  - You are about to drop the `Service` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `birth` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'BARBER', 'CLIENT');

-- DropForeignKey
ALTER TABLE "Service" DROP CONSTRAINT "Service_barbershopId_fkey";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "birth" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'CLIENT';

-- DropTable
DROP TABLE "Service";

-- CreateTable
CREATE TABLE "Services" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" MONEY NOT NULL,
    "barbershopId" TEXT NOT NULL,

    CONSTRAINT "Services_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SchedulingService" (
    "id" TEXT NOT NULL,
    "barbershopId" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "barberId" TEXT NOT NULL,
    "priceTotal" MONEY NOT NULL,

    CONSTRAINT "SchedulingService_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NoSchedulingService" (
    "id" TEXT NOT NULL,
    "barbershopId" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "barberId" TEXT NOT NULL,
    "priceTotal" MONEY NOT NULL,

    CONSTRAINT "NoSchedulingService_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_SchedulingServiceToServices" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_SchedulingServiceToServices_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_NoSchedulingServiceToServices" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_NoSchedulingServiceToServices_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "SchedulingService_barbershopId_key" ON "SchedulingService"("barbershopId");

-- CreateIndex
CREATE UNIQUE INDEX "SchedulingService_clientId_key" ON "SchedulingService"("clientId");

-- CreateIndex
CREATE UNIQUE INDEX "SchedulingService_barberId_key" ON "SchedulingService"("barberId");

-- CreateIndex
CREATE UNIQUE INDEX "NoSchedulingService_barbershopId_key" ON "NoSchedulingService"("barbershopId");

-- CreateIndex
CREATE UNIQUE INDEX "NoSchedulingService_clientId_key" ON "NoSchedulingService"("clientId");

-- CreateIndex
CREATE UNIQUE INDEX "NoSchedulingService_barberId_key" ON "NoSchedulingService"("barberId");

-- CreateIndex
CREATE INDEX "_SchedulingServiceToServices_B_index" ON "_SchedulingServiceToServices"("B");

-- CreateIndex
CREATE INDEX "_NoSchedulingServiceToServices_B_index" ON "_NoSchedulingServiceToServices"("B");

-- AddForeignKey
ALTER TABLE "Services" ADD CONSTRAINT "Services_barbershopId_fkey" FOREIGN KEY ("barbershopId") REFERENCES "Barbershop"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SchedulingService" ADD CONSTRAINT "SchedulingService_barberId_fkey" FOREIGN KEY ("barberId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SchedulingService" ADD CONSTRAINT "SchedulingService_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SchedulingService" ADD CONSTRAINT "SchedulingService_barbershopId_fkey" FOREIGN KEY ("barbershopId") REFERENCES "Barbershop"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NoSchedulingService" ADD CONSTRAINT "NoSchedulingService_barberId_fkey" FOREIGN KEY ("barberId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NoSchedulingService" ADD CONSTRAINT "NoSchedulingService_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NoSchedulingService" ADD CONSTRAINT "NoSchedulingService_barbershopId_fkey" FOREIGN KEY ("barbershopId") REFERENCES "Barbershop"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SchedulingServiceToServices" ADD CONSTRAINT "_SchedulingServiceToServices_A_fkey" FOREIGN KEY ("A") REFERENCES "SchedulingService"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SchedulingServiceToServices" ADD CONSTRAINT "_SchedulingServiceToServices_B_fkey" FOREIGN KEY ("B") REFERENCES "Services"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_NoSchedulingServiceToServices" ADD CONSTRAINT "_NoSchedulingServiceToServices_A_fkey" FOREIGN KEY ("A") REFERENCES "NoSchedulingService"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_NoSchedulingServiceToServices" ADD CONSTRAINT "_NoSchedulingServiceToServices_B_fkey" FOREIGN KEY ("B") REFERENCES "Services"("id") ON DELETE CASCADE ON UPDATE CASCADE;
