// src/barbershop/barbershop.repository.ts
import { Injectable } from '@nestjs/common';
import { AddressBarbershop, Barbershop } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { BarbershopRequestDto } from './dtos/barbeshop.request.dto';

@Injectable()
export class BarbershopRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createAddress(data: BarbershopRequestDto): Promise<AddressBarbershop> {
    return this.prisma.addressBarbershop.create({
      data: {
        number: data.number,
        street: data.street,
        complement: data.complement,
        neighborhood: data.neighborhood,
        city: data.city,
        state: data.state,
        country: data.country,
        zipCode: data.zipCode,
      },
    });
  }

  async createBarbershop(
    data: BarbershopRequestDto,
    addressId: string,
  ): Promise<Barbershop> {
    return this.prisma.barbershop.create({
      data: {
        name: data.name,
        imageUrl: data.imageUrl,
        timeOpen: data.timeOpen,
        timeClose: data.timeClose,
        addressId,
      },
    });
  }

  async findById(barbershopId: string): Promise<Barbershop | null> {
    return this.prisma.barbershop.findUnique({
      where: { id: barbershopId },
    });
  }

  async findAddressById(addressId: string): Promise<AddressBarbershop | null> {
    return this.prisma.addressBarbershop.findUnique({
      where: { id: addressId },
    });
  }

  async updateAddress(
    addressId: string,
    data: BarbershopRequestDto,
  ): Promise<AddressBarbershop> {
    return this.prisma.addressBarbershop.update({
      where: { id: addressId },
      data: {
        number: data.number,
        street: data.street,
        complement: data.complement,
        neighborhood: data.neighborhood,
        city: data.city,
        state: data.state,
        country: data.country,
        zipCode: data.zipCode,
      },
    });
  }

  async updateBarbershop(
    barbershopId: string,
    data: BarbershopRequestDto,
  ): Promise<Barbershop> {
    return this.prisma.barbershop.update({
      where: { id: barbershopId },
      data: {
        name: data.name,
        imageUrl: data.imageUrl,
        timeOpen: data.timeOpen,
        timeClose: data.timeClose,
      },
    });
  }

  async deleteById(barbershopId: string): Promise<Barbershop> {
    return this.prisma.barbershop.delete({
      where: { id: barbershopId },
    });
  }

  async findAllByName(name: string): Promise<Barbershop[]> {
    return this.prisma.barbershop.findMany({
      where: {
        name: {
          contains: name,
          mode: 'insensitive',
        },
      },
    });
  }
}
