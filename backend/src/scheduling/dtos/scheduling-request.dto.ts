import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsDate,
  IsNumber,
  IsUUID,
  IsEnum,
} from 'class-validator';

export class SchedulingRequestDto {
  @IsUUID()
  readonly clientId!: string;

  @IsUUID()
  readonly employeeId!: string;

  @IsUUID()
  readonly barbershopId!: string;

  @IsEnum(StatusEnum)
  readonly status!: StatusEnum;

  @IsDate()
  @Type(() => Date)
  readonly dateTime!: Date;

  @IsNumber()
  readonly totalPrice!: number;

  @IsArray()
  @ArrayNotEmpty()
  readonly servicesIds!: number[];
}
