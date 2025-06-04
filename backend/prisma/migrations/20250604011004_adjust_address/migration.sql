/*
  Warnings:

  - You are about to drop the column `bairro` on the `AddressBarbershop` table. All the data in the column will be lost.
  - You are about to drop the column `cep` on the `AddressBarbershop` table. All the data in the column will be lost.
  - You are about to drop the column `cidade` on the `AddressBarbershop` table. All the data in the column will be lost.
  - You are about to drop the column `estado` on the `AddressBarbershop` table. All the data in the column will be lost.
  - You are about to drop the column `país` on the `AddressBarbershop` table. All the data in the column will be lost.
  - You are about to drop the column `rua` on the `AddressBarbershop` table. All the data in the column will be lost.
  - Added the required column `city` to the `AddressBarbershop` table without a default value. This is not possible if the table is not empty.
  - Added the required column `country` to the `AddressBarbershop` table without a default value. This is not possible if the table is not empty.
  - Added the required column `neighborhood` to the `AddressBarbershop` table without a default value. This is not possible if the table is not empty.
  - Added the required column `state` to the `AddressBarbershop` table without a default value. This is not possible if the table is not empty.
  - Added the required column `street` to the `AddressBarbershop` table without a default value. This is not possible if the table is not empty.
  - Added the required column `zipCode` to the `AddressBarbershop` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AddressBarbershop" DROP COLUMN "bairro",
DROP COLUMN "cep",
DROP COLUMN "cidade",
DROP COLUMN "estado",
DROP COLUMN "país",
DROP COLUMN "rua",
ADD COLUMN     "city" TEXT NOT NULL,
ADD COLUMN     "country" TEXT NOT NULL,
ADD COLUMN     "neighborhood" TEXT NOT NULL,
ADD COLUMN     "state" TEXT NOT NULL,
ADD COLUMN     "street" TEXT NOT NULL,
ADD COLUMN     "zipCode" TEXT NOT NULL;
