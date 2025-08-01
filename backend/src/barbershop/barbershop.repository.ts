// src/barbershop/barbershop.repository.ts
import { subDays, startOfWeek, endOfWeek } from 'date-fns';
import { Injectable } from '@nestjs/common';
import { AddressBarbershop, Barbershop } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { BarbershopRequestDto } from './dtos/barbeshop.request.dto';
import { BarbershopUpdateDto } from './dtos/barbershop.update.dto';

@Injectable()
export class BarbershopRepository {
  constructor(private readonly prisma: PrismaService) { }

  async createAddress(data: BarbershopRequestDto): Promise<AddressBarbershop> {
    return await this.prisma.addressBarbershop.create({
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
    return await this.prisma.barbershop.create({
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
    return await this.prisma.barbershop.findUnique({
      where: { id: barbershopId },
    });
  }

  async findAddressById(addressId: string): Promise<AddressBarbershop | null> {
    return await this.prisma.addressBarbershop.findUnique({
      where: { id: addressId },
    });
  }

  async updateAddress(
    addressId: string,
    data: BarbershopUpdateDto,
  ): Promise<AddressBarbershop> {
    return await this.prisma.addressBarbershop.update({
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
    data: BarbershopUpdateDto,
  ): Promise<Barbershop> {
    return await this.prisma.barbershop.update({
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
    return await this.prisma.barbershop.delete({
      where: { id: barbershopId },
    });
  }

  async findAllByName(name: string): Promise<Barbershop[]> {
    return await this.prisma.barbershop.findMany({
      where: {
        name: {
          contains: name,
          mode: 'insensitive',
        },
      },
    });
  }

  async getQuantityOfSubscribersById(id: string) {
    return await this.prisma.clientSubscribeBarbershop.count({
      where: { barbershopId: id },
    });
  }

  async getQuantityOfSubscribersByIdOfIntervalDate(
    id: string,
    from: Date,
    to: Date,
  ) {
    return await this.prisma.clientSubscribeBarbershop.count({
      where: { barbershopId: id, subscribeIn: { gte: from, lte: to } },
    });
  }

  async getQuantityOfServicesInSchedulesById(id: string) {
    return await this.prisma.scheduling.findMany({
      where: { barbershopId: id },
      include: {
        _count: { select: { services: true } },
      },
    });
  }

  async getQuantityOfServicesInSchedulesByIdOfIntervalDate(
    id: string,
    from: Date,
    to: Date,
  ) {
    return await this.prisma.scheduling.findMany({
      where: { barbershopId: id, dateTime: { gte: from, lte: to } },
      include: {
        _count: { select: { services: true } },
      },
    });
  }

  async getStatus(barbershopId: string) {
    const today = new Date();
    const thirtyDaysAgo = subDays(today, 30);
    const startWeek = startOfWeek(today, { weekStartsOn: 1 }); // segunda-feira
    const endWeek = endOfWeek(today, { weekStartsOn: 1 });     // domingo

    const status = await this.prisma.barbershop.findUnique({
      where: { id: barbershopId },
      select: {
        id: true,
        name: true,

        // número de clientes inscritos
        clientSubscribeBarbershop: {
          select: { clientId: true },
        },

        // agendamentos nos últimos 30 dias
        Scheduling: {
          where: {
            dateTime: {
              gte: thirtyDaysAgo,
              lte: today,
            },
            status: 'DONE', // apenas concluídos contam como faturamento
          },
          select: {
            priceTotal: true,
            services: {
              select: { serviceId: true },
            },
          },
        },

        // agendamentos da semana atual
        _count: {
          select: {
            Scheduling: {
              where: {
                dateTime: {
                  gte: startWeek,
                  lte: endWeek,
                },
              },
            },
          },
        },
      },
    });
    console.log(status)
  }

}
