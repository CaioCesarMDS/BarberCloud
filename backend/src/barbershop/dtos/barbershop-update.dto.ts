import { PartialType } from '@nestjs/mapped-types';
import { BarbershopCreateDto } from './barbershop-create.dto';

export class BarbershopUpdateDto extends PartialType(BarbershopCreateDto) {}
