import Decimal from 'decimal.js';
import { StatusEnum } from '../enums/status.enum';

export class SchedulingRequestDto {
    readonly clientId!: string;
    readonly employeeId!: string;
    readonly barbershopId!: string;
    readonly status!: StatusEnum;
    readonly dateTime!: Date;
    readonly totalPrice!: Decimal;
    readonly servicesIds!: number[];
}
