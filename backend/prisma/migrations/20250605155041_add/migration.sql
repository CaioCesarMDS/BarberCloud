-- CreateTable
CREATE TABLE "ClientSubscribeBarbershop" (
    "clientId" TEXT NOT NULL,
    "barbershopId" TEXT NOT NULL,
    "subscribeIn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ClientSubscribeBarbershop_pkey" PRIMARY KEY ("clientId","barbershopId")
);

-- AddForeignKey
ALTER TABLE "ClientSubscribeBarbershop" ADD CONSTRAINT "ClientSubscribeBarbershop_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClientSubscribeBarbershop" ADD CONSTRAINT "ClientSubscribeBarbershop_barbershopId_fkey" FOREIGN KEY ("barbershopId") REFERENCES "Barbershop"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
