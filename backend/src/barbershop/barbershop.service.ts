// src/barbershop/barbershop.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { BarbershopRepository } from './barbershop.repository';
import { BarbershopResponseDto } from './dtos/barbershop.response.dto';
import { BarbershopRequestDto } from './dtos/barbeshop.request.dto';
import { BarbershopUpdateDto } from './dtos/barbershop.update.dto';
import { ServicesService } from 'src/services/services.service';

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
    data: BarbershopUpdateDto,
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

  async findAllByName(name: string): Promise<BarbershopResponseDto[]> {
    const barbershops = await this.barbershopRepository.findAllByName(name);
    if (!barbershops || barbershops.length === 0) {
      throw new NotFoundException('No barbershops found with that name');
    }

    const results: BarbershopResponseDto[] = [];

    for (const barbershop of barbershops) {
      const address = await this.barbershopRepository.findAddressById(
        barbershop.addressId,
      );
      if (!address) throw new NotFoundException('Address not found');

      results.push(new BarbershopResponseDto(barbershop, address));
    }
    return results;
  }

  async getBarbershopStatus(barbershopId: string) {
    this.barbershopRepository.getStatus(barbershopId);
  }
}
