/*
  Warnings:

  - Added the required column `status` to the `Scheduling` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ScheduleStatus" AS ENUM ('CANCEL', 'PENDING', 'DONE');

-- AlterTable
ALTER TABLE "Scheduling" ADD COLUMN     "status" "ScheduleStatus" NOT NULL;
