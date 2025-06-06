import { Injectable } from '@nestjs/common';
import { Barbershop } from '@prisma/client';
import { BarbershopRepository } from './barbershop.repository';
import { BarbershopCreateDto } from './dtos/barbershop-create.dto';
import { BarbershopUpdateDto } from './dtos/barbershop-update.dto';

@Injectable()
export class BarbershopService {
  constructor(private readonly barbershopRepository: BarbershopRepository) {}

  create(addressId: string, data: BarbershopCreateDto): Promise<Barbershop> {
    return this.barbershopRepository.create(addressId, data);
  }

  async update(id: string, data: BarbershopUpdateDto): Promise<Barbershop> {
    const barbershop = await this.barbershopRepository.update(id, data);
    return this.ensureBarbershopExists(barbershop);
  }

  async delete(id: string): Promise<Barbershop | null> {
    const barbershop = await this.barbershopRepository.softDelete(id);
    if (!barbershop) {
      throw new Error('Barbershop not found');
    }
    return barbershop;
  }

  async find(id: string): Promise<Barbershop | null> {
    const barbershop = await this.barbershopRepository.find(id);
    return this.ensureBarbershopExists(barbershop);
  }

  private ensureBarbershopExists(barbershop: Barbershop | null): Barbershop {
    if (!barbershop || !barbershop.isActive) {
      throw new Error('Barbershop not found');
    }
    return barbershop;
  }
}
