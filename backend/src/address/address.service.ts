import { Injectable } from '@nestjs/common';
import { Address } from '@prisma/client';
import { AddressRepository } from './address.repository';
import { CreateAddressDto } from './dtos/create-address.dto';
import { UpdateAddressDto } from './dtos/update-address.dto';

@Injectable()
export class AddressService {
  constructor(private readonly addressRepository: AddressRepository) {}

  async create(data: CreateAddressDto): Promise<Address> {
    const address = await this.addressRepository.create(data);
    if (!address) {
      throw new Error('Failed to create address');
    }
    return address;
  }

  async update(id: string, data: UpdateAddressDto): Promise<Address> {
    const address = await this.addressRepository.update(id, data);
    if (!address) {
      throw new Error('Address not found or update failed');
    }
    return address;
  }
}
