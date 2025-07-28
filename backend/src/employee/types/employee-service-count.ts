import { Role } from "@prisma/client";

export type EmployeeWithServiceCount = {
  id: number;
  name: string;
  birth: Date;
  phone: string;
  email: string;
  role: Role;
  barbershopId: string;
  totalServicesRealizeds: number;
};