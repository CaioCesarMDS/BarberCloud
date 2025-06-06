import { Barbershop } from '@prisma/client';
import { BarbershopCreateDto } from '../dtos/barbershop-create.dto';
import { BarbershopUpdateDto } from '../dtos/barbershop-update.dto';

export interface IBarbershopRepository {
  create(addressId: string, data: BarbershopCreateDto): Promise<Barbershop>;
  update(id: string, userData: BarbershopUpdateDto): Promise<Barbershop>;
  softDelete(id: string): Promise<Barbershop>;
  find(id: string): Promise<Barbershop | null>;
}
