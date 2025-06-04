-- DropForeignKey
ALTER TABLE "Barbershop" DROP CONSTRAINT "Barbershop_addressId_fkey";

-- AlterTable
ALTER TABLE "Barbershop" ALTER COLUMN "addressId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Barbershop" ADD CONSTRAINT "Barbershop_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "AddressBarbershop"("id") ON DELETE CASCADE ON UPDATE CASCADE;
