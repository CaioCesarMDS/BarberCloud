import { Services } from '@prisma/client';
import Decimal from 'decimal.js';

export class ServicesResponseDto {
  id!: number;
  barbershopId!: string;
  name!: string;
  description!: string;
  price!: Decimal;

  constructor(service: Services) {
    this.id = Number(service.id);
    this.barbershopId = service.barbershopId;
    this.name = service.name;
    this.description = service.description;
    this.price = service.price;
  }
}
