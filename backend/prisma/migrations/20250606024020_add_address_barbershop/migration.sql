/*
  Warnings:

  - You are about to drop the column `address` on the `Barbershop` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[addressId]` on the table `Barbershop` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `addressId` to the `Barbershop` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Barbershop" DROP COLUMN "address",
ADD COLUMN     "addressId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "AddressBarbershop" (
    "id" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    "street" TEXT NOT NULL,
    "complement" TEXT NOT NULL,
    "neighborhood" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "zipCode" TEXT NOT NULL,

    CONSTRAINT "AddressBarbershop_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AddressBarbershop_id_key" ON "AddressBarbershop"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Barbershop_addressId_key" ON "Barbershop"("addressId");

-- AddForeignKey
ALTER TABLE "Barbershop" ADD CONSTRAINT "Barbershop_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "AddressBarbershop"("id") ON DELETE CASCADE ON UPDATE CASCADE;
