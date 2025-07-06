import { Role, Employee, Services } from '@prisma/client';
import Decimal from 'decimal.js';

export class SchedulingRequestDto {
    readonly clientId!: string;
    readonly employeeId!: string;
    readonly barbershopId!: string;
    readonly dateTime!: Date;
    readonly totalPrice!: Decimal;
    readonly servicesIds!: number[];
}
