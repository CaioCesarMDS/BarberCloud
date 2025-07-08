import Decimal from 'decimal.js';
import { StatusEnum } from '../enums/status.enum';
import { IsArray, IsDate, IsDecimal, IsEnum, IsOptional, isString } from 'class-validator';

export class SchedulingUpdateDto {
    @IsOptional()
    @IsEnum(StatusEnum)
    readonly status?: StatusEnum;
    @IsOptional()
    @IsDate()
    readonly dateTime?: Date;
    @IsOptional()
    @IsDecimal()
    readonly totalPrice?: Decimal;
    @IsOptional()
    @IsArray()
    readonly servicesIds?: number[];
}
