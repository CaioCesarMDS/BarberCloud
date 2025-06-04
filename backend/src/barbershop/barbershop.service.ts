import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { BarbershopRequestDto } from './dtos/barbershop.request.dto';
import { BarbershopResponseDto } from './dtos/barbershop.response.dto';
import { AddressBarbershop, Barbershop } from '@prisma/client';

@Injectable()
export class BarbershopService {

  constructor(private prisma: PrismaService) { }

  async create(data: BarbershopRequestDto): Promise<BarbershopResponseDto | null> {
    const address = await this.prisma.addressBarbershop.create({
      data: {
        number: data.number,
        street: data.street,
        complement: data.complement,
        neighborhood: data.neighborhood,
        city: data.city,
        state: data.state,
        country: data.country,
        zipCode: data.zipCode
      }
    });
    const barbershop = await this.prisma.barbershop.create({
      data: {
        name: data.name,
        imageUrl: data.imageUrl,
        timeOpen: data.timeOpen,
        timeClose: data.timeClose,
        addressId: address.id
      },
    });

    return new BarbershopResponseDto(barbershop, address);
  }

  async getbyId(barbershopId: string): Promise<BarbershopResponseDto | null> {
    const barbershop: Barbershop | null = await this.prisma.barbershop.findUnique({ where: { id: barbershopId } });
    const address: AddressBarbershop | null = await this.prisma.addressBarbershop.findUnique({ where: { id: barbershop?.addressId } });
    if (barbershop && address) {
      return new BarbershopResponseDto(barbershop, address);
    } else {
      throw new BadRequestException("Barbershop not found!");
    }
  }

  async updateById(barbershopId: string, data: BarbershopRequestDto): Promise<BarbershopResponseDto | null> {
    const barbershop: Barbershop | null = await this.prisma.barbershop.findUnique({ where: { id: barbershopId } });
    const address: AddressBarbershop | null = await this.prisma.addressBarbershop.findUnique({ where: { id: barbershop?.addressId } });

    if (barbershop && address) {
      await this.prisma.addressBarbershop.update({
        where: { id: barbershop?.addressId },
        data: {
          number: data.number,
          street: data.street,
          complement: data.complement,
          neighborhood: data.neighborhood,
          city: data.city,
          state: data.state,
          country: data.country,
          zipCode: data.zipCode
        }
      })
      await this.prisma.barbershop.update(
        {
          where: { id: barbershopId },
          data: {
            name: data.name,
            imageUrl: data.imageUrl,
            timeOpen: data.timeOpen,
            timeClose: data.timeClose,
            addressId: address.id
          }
        });

      return await this.getbyId(barbershopId);
    } else {
      throw new BadRequestException("Barbershop not found!");
    }
  }

  async deleteById(barbershopId: string): Promise<any | null> {
    const barbershop: Barbershop | null = await this.prisma.barbershop.findUnique({ where: { id: barbershopId } });
    if (barbershop) {
      await this.prisma.barbershop.delete({ where: { id: barbershopId } });
      return {
        success: true,
        message: "User has been deleted with success!"
      }
    } else {
      throw new BadRequestException("Barbershop not found!");
    }
  }
}
