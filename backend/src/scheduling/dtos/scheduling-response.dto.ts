import { Services } from '@prisma/client';
import Decimal from 'decimal.js';
import { StatusEnum } from '../enums/status.enum';
import { SchedulingWithAll } from '../types/scheduling-with-all.type';

export class SchedulingResponseDto {
  readonly id!: string;
  readonly clientId!: string;
  readonly clientName!: string;
  readonly employeeId!: string;
  readonly employeeName!: string;
  readonly barbershopId!: string;
  readonly barbershopName!: string;
  readonly status!: StatusEnum;
  readonly dateTime!: Date;
  readonly totalPrice!: Decimal;
  readonly services!: Services[];

  constructor(scheduling: SchedulingWithAll) {
    this.id = scheduling.id;
    this.clientId = scheduling.clientId;
    this.clientName = scheduling.client.name;
    this.employeeId = scheduling.employeeId;
    this.employeeName = scheduling.employee.name;
    this.barbershopId = scheduling.barbershopId;
    this.barbershopName = scheduling.barbershop.name;
    this.status = scheduling.status as unknown as StatusEnum;
    this.dateTime = new Date(scheduling.dateTime.toISOString());
    this.totalPrice = scheduling.priceTotal;
    this.services = scheduling.services.map((service) => service.service);
  }
}
