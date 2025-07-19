import { Decimal } from "@prisma/client/runtime/library";

export type ServiceWithTotal = {
  id: number;
  name: string;
  description: string;
  price: Decimal;
  barbershopId: string;
  totalServices: number;
};