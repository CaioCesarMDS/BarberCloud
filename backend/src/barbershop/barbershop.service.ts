// src/barbershop/barbershop.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { BarbershopRepository } from './barbershop.repository';
import { BarbershopRequestDto } from './dtos/barbershop.request.dto';
import { BarbershopResponseDto } from './dtos/barbershop.response.dto';

@Injectable()
export class BarbershopService {
  constructor(private readonly barbershopRepository: BarbershopRepository) {}

  async create(data: BarbershopRequestDto): Promise<BarbershopResponseDto> {
    const address = await this.barbershopRepository.createAddress(data);

    const barbershop = await this.barbershopRepository.createBarbershop(
      data,
      address.id,
    );

    return new BarbershopResponseDto(barbershop, address);
  }

  async getById(id: string): Promise<BarbershopResponseDto> {
    const barbershop = await this.barbershopRepository.findById(id);
    if (!barbershop) throw new NotFoundException('Barbershop not found');

    const address = await this.barbershopRepository.findAddressById(
      barbershop.addressId,
    );
    if (!address) throw new NotFoundException('Address not found');

    return new BarbershopResponseDto(barbershop, address);
  }

  async updateById(
    id: string,
    data: BarbershopRequestDto,
  ): Promise<BarbershopResponseDto> {
    const barbershop = await this.barbershopRepository.findById(id);
    if (!barbershop) throw new NotFoundException('Barbershop not found');

    await this.barbershopRepository.updateAddress(barbershop.addressId, data);

    await this.barbershopRepository.updateBarbershop(id, data);

    return this.getById(id);
  }

  async deleteById(id: string): Promise<{ success: boolean; message: string }> {
    const barbershop = await this.barbershopRepository.findById(id);
    if (!barbershop) throw new NotFoundException('Barbershop not found');

    await this.barbershopRepository.deleteById(id);
    return {
      success: true,
      message: 'Barbershop deleted successfully',
    };
  }
}
