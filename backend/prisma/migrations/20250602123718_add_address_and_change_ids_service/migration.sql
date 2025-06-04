/*
  Warnings:

  - You are about to drop the column `address` on the `Barbershop` table. All the data in the column will be lost.
  - The primary key for the `NoSchedulingService` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `NoSchedulingService` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `SchedulingService` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `SchedulingService` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `_BarberServicesToNoSchedulingService` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `_BarberServicesToSchedulingService` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[addressId]` on the table `Barbershop` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `addressId` to the `Barbershop` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `B` on the `_BarberServicesToNoSchedulingService` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `B` on the `_BarberServicesToSchedulingService` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "_BarberServicesToNoSchedulingService" DROP CONSTRAINT "_BarberServicesToNoSchedulingService_B_fkey";

-- DropForeignKey
ALTER TABLE "_BarberServicesToSchedulingService" DROP CONSTRAINT "_BarberServicesToSchedulingService_B_fkey";

-- AlterTable
ALTER TABLE "Barbershop" DROP COLUMN "address",
ADD COLUMN     "addressId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "NoSchedulingService" DROP CONSTRAINT "NoSchedulingService_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "NoSchedulingService_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "SchedulingService" DROP CONSTRAINT "SchedulingService_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "SchedulingService_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "_BarberServicesToNoSchedulingService" DROP CONSTRAINT "_BarberServicesToNoSchedulingService_AB_pkey",
DROP COLUMN "B",
ADD COLUMN     "B" INTEGER NOT NULL,
ADD CONSTRAINT "_BarberServicesToNoSchedulingService_AB_pkey" PRIMARY KEY ("A", "B");

-- AlterTable
ALTER TABLE "_BarberServicesToSchedulingService" DROP CONSTRAINT "_BarberServicesToSchedulingService_AB_pkey",
DROP COLUMN "B",
ADD COLUMN     "B" INTEGER NOT NULL,
ADD CONSTRAINT "_BarberServicesToSchedulingService_AB_pkey" PRIMARY KEY ("A", "B");

-- CreateTable
CREATE TABLE "AdressBarbershop" (
    "id" TEXT NOT NULL,
    "rua" TEXT NOT NULL,
    "Bairro" TEXT NOT NULL,
    "Cidade" TEXT NOT NULL,
    "Estado" TEXT NOT NULL,
    "País" TEXT NOT NULL,
    "Cep" TEXT NOT NULL,

    CONSTRAINT "AdressBarbershop_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AdressBarbershop_id_key" ON "AdressBarbershop"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Barbershop_addressId_key" ON "Barbershop"("addressId");

-- CreateIndex
CREATE UNIQUE INDEX "NoSchedulingService_id_key" ON "NoSchedulingService"("id");

-- CreateIndex
CREATE UNIQUE INDEX "SchedulingService_id_key" ON "SchedulingService"("id");

-- CreateIndex
CREATE INDEX "_BarberServicesToNoSchedulingService_B_index" ON "_BarberServicesToNoSchedulingService"("B");

-- CreateIndex
CREATE INDEX "_BarberServicesToSchedulingService_B_index" ON "_BarberServicesToSchedulingService"("B");

-- AddForeignKey
ALTER TABLE "Barbershop" ADD CONSTRAINT "Barbershop_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "AdressBarbershop"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BarberServicesToSchedulingService" ADD CONSTRAINT "_BarberServicesToSchedulingService_B_fkey" FOREIGN KEY ("B") REFERENCES "SchedulingService"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BarberServicesToNoSchedulingService" ADD CONSTRAINT "_BarberServicesToNoSchedulingService_B_fkey" FOREIGN KEY ("B") REFERENCES "NoSchedulingService"("id") ON DELETE CASCADE ON UPDATE CASCADE;
