import { Injectable } from '@nestjs/common';
import { Address } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { CreateAddressDto } from './dtos/create-address.dto';
import { UpdateAddressDto } from './dtos/update-address.dto';
import { IAddressRepository } from './interfaces/address-repository.interface';

@Injectable()
export class AddressRepository implements IAddressRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(data: CreateAddressDto): Promise<Address> {
    return this.prisma.address.create({
      data: {
        number: data.number,
        street: data.street,
        neighborhood: data.neighborhood,
        city: data.city,
        state: data.state,
        country: data.country,
        zipCode: data.zipCode,
      },
    });
  }

  update(addressId: string, data: UpdateAddressDto): Promise<Address> {
    return this.prisma.address.update({
      where: { id: addressId },
      data: {
        number: data.number,
        street: data.street,
        neighborhood: data.neighborhood,
        city: data.city,
        state: data.state,
        country: data.country,
        zipCode: data.zipCode,
      },
    });
  }
}
