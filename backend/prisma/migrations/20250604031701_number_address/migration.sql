-- AlterTable
ALTER TABLE "AddressBarbershop" ALTER COLUMN "number" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Barbershop" ALTER COLUMN "timeClose" SET DATA TYPE TIME(6),
ALTER COLUMN "timeOpen" SET DATA TYPE TIME(6);
