/*
  Warnings:

  - The primary key for the `Services` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Services` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `ServicesOnScheduling` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Changed the type of `serviceId` on the `ServicesOnScheduling` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "ServicesOnScheduling" DROP CONSTRAINT "ServicesOnScheduling_serviceId_fkey";

-- AlterTable
ALTER TABLE "Services" DROP CONSTRAINT "Services_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Services_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "ServicesOnScheduling" DROP CONSTRAINT "ServicesOnScheduling_pkey",
DROP COLUMN "serviceId",
ADD COLUMN     "serviceId" INTEGER NOT NULL,
ADD CONSTRAINT "ServicesOnScheduling_pkey" PRIMARY KEY ("serviceId", "schedulingId");

-- CreateIndex
CREATE UNIQUE INDEX "Services_id_key" ON "Services"("id");

-- AddForeignKey
ALTER TABLE "ServicesOnScheduling" ADD CONSTRAINT "ServicesOnScheduling_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Services"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
