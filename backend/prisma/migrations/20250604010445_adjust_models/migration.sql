/*
  Warnings:

  - You are about to drop the `AdressBarbershop` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Barbershop" DROP CONSTRAINT "Barbershop_addressId_fkey";

-- DropTable
DROP TABLE "AdressBarbershop";

-- CreateTable
CREATE TABLE "AddressBarbershop" (
    "id" TEXT NOT NULL,
    "number" INTEGER NOT NULL,
    "rua" TEXT NOT NULL,
    "complement" TEXT NOT NULL,
    "bairro" TEXT NOT NULL,
    "cidade" TEXT NOT NULL,
    "estado" TEXT NOT NULL,
    "país" TEXT NOT NULL,
    "cep" TEXT NOT NULL,

    CONSTRAINT "AddressBarbershop_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AddressBarbershop_id_key" ON "AddressBarbershop"("id");

-- AddForeignKey
ALTER TABLE "Barbershop" ADD CONSTRAINT "Barbershop_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "AddressBarbershop"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
