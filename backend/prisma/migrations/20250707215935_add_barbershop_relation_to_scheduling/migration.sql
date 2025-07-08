-- AddForeignKey
ALTER TABLE "Scheduling" ADD CONSTRAINT "Scheduling_barbershopId_fkey" FOREIGN KEY ("barbershopId") REFERENCES "Barbershop"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
