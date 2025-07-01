import { IsDecimal, IsOptional, IsString } from "class-validator";
import Decimal from "decimal.js";

export class ServicesUpdateDto {
    @IsOptional()
    @IsString()
    name?: string;
    @IsOptional()
    @IsString()
    description?: string;
    @IsOptional()
    @IsDecimal()
    price?: Decimal;
}