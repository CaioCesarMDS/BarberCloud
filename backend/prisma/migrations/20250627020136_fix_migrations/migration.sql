-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'EMPLOYEE');

-- CreateTable
CREATE TABLE "Client" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "birth" TIMESTAMP(3) NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "Client_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClientSubscribeBarbershop" (
    "clientId" TEXT NOT NULL,
    "barbershopId" TEXT NOT NULL,
    "subscribeIn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ClientSubscribeBarbershop_pkey" PRIMARY KEY ("clientId","barbershopId")
);

-- CreateTable
CREATE TABLE "Barbershop" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "timeOpen" TEXT NOT NULL,
    "timeClose" TEXT NOT NULL,
    "addressId" TEXT NOT NULL,

    CONSTRAINT "Barbershop_pkey" PRIMARY KEY ("id")
);

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

-- CreateTable
CREATE TABLE "Employee" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "birth" TIMESTAMP(3) NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'EMPLOYEE',
    "barbershopId" TEXT NOT NULL,

    CONSTRAINT "Employee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Services" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" MONEY NOT NULL,
    "barbershopId" TEXT NOT NULL,

    CONSTRAINT "Services_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ServicesOnScheduling" (
    "serviceId" TEXT NOT NULL,
    "schedulingId" TEXT NOT NULL,

    CONSTRAINT "ServicesOnScheduling_pkey" PRIMARY KEY ("serviceId","schedulingId")
);

-- CreateTable
CREATE TABLE "Scheduling" (
    "id" TEXT NOT NULL,
    "barbershopId" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "dateTime" TIMESTAMP(3) NOT NULL,
    "priceTotal" MONEY NOT NULL,

    CONSTRAINT "Scheduling_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Client_phone_key" ON "Client"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "Client_email_key" ON "Client"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Barbershop_addressId_key" ON "Barbershop"("addressId");

-- CreateIndex
CREATE UNIQUE INDEX "Employee_phone_key" ON "Employee"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "Employee_email_key" ON "Employee"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Services_id_key" ON "Services"("id");

-- AddForeignKey
ALTER TABLE "ClientSubscribeBarbershop" ADD CONSTRAINT "ClientSubscribeBarbershop_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClientSubscribeBarbershop" ADD CONSTRAINT "ClientSubscribeBarbershop_barbershopId_fkey" FOREIGN KEY ("barbershopId") REFERENCES "Barbershop"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Barbershop" ADD CONSTRAINT "Barbershop_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "AddressBarbershop"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Employee" ADD CONSTRAINT "Employee_barbershopId_fkey" FOREIGN KEY ("barbershopId") REFERENCES "Barbershop"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Services" ADD CONSTRAINT "Services_barbershopId_fkey" FOREIGN KEY ("barbershopId") REFERENCES "Barbershop"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServicesOnScheduling" ADD CONSTRAINT "ServicesOnScheduling_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Services"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServicesOnScheduling" ADD CONSTRAINT "ServicesOnScheduling_schedulingId_fkey" FOREIGN KEY ("schedulingId") REFERENCES "Scheduling"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Scheduling" ADD CONSTRAINT "Scheduling_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Scheduling" ADD CONSTRAINT "Scheduling_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
