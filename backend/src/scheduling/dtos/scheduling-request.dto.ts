import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsDate,
  IsNumber,
  IsUUID,
} from 'class-validator';

export class SchedulingRequestDto {
  @IsUUID()
  readonly clientId!: string;

  @IsUUID()
  readonly employeeId!: string;

  @IsUUID()
  readonly barbershopId!: string;

  @IsDate()
  @Type(() => Date)
  readonly dateTime!: Date;

  @IsNumber()
  readonly totalPrice!: number;

  @IsArray()
  @ArrayNotEmpty()
  readonly servicesIds!: number[];
}
