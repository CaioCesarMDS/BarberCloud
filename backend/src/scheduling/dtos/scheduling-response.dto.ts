import { Role, Employee, Scheduling, Services, ServicesOnScheduling } from '@prisma/client';
import Decimal from 'decimal.js';

export class SchedulingResponseDto {
  
  readonly id!: string;
  readonly clientId!: string;
  readonly employeeId!: string;
  readonly barbershopId!: string;
  readonly dateTime!: Date;
  readonly totalPrice!: Decimal;
  readonly services!: Services[];

  constructor(scheduling: Scheduling, services: Services[]) {
    this.id = scheduling.id;
    this.clientId = scheduling.clientId;
    this.employeeId = scheduling.employeeId;
    this.barbershopId = scheduling.barbershopId;
    this.dateTime = new Date(scheduling.dateTime.toISOString());
    this.totalPrice = scheduling.priceTotal;
    this.services = services;
  }
}
