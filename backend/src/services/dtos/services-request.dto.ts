import { IsDecimal, IsNotEmpty, IsString, IsUUID } from 'class-validator';
import Decimal from 'decimal.js';

export class ServicesRequestDto {
  @IsUUID()
  @IsString()
  @IsNotEmpty()
  barbershopId!: string;
  @IsString()
  @IsNotEmpty()
  name!: string;
  @IsString()
  @IsNotEmpty()
  description!: string;
  @IsDecimal()
  @IsNotEmpty()
  price!: Decimal;
}
