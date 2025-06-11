/*
  Warnings:

  - You are about to drop the column `priceTotal` on the `ServicesOnScheduling` table. All the data in the column will be lost.
  - Added the required column `priceTotal` to the `Scheduling` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Scheduling" ADD COLUMN     "priceTotal" MONEY NOT NULL;

-- AlterTable
ALTER TABLE "ServicesOnScheduling" DROP COLUMN "priceTotal";
