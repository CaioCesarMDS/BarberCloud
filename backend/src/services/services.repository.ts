import { Injectable } from '@nestjs/common';
import { Services } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { ServicesRequestDto } from './dtos/services-request.dto';
import { ServicesUpdateDto } from './dtos/services-update.dto';
import { IServicesRepositoryInterface } from './interfaces/services-repository.interface';

@Injectable()
export class ServicesRepository implements IServicesRepositoryInterface {
  constructor(private readonly prismaService: PrismaService) {}

  async findById(id: number): Promise<Services | null> {
    return await this.prismaService.services.findUnique({
      where: { id: id },
    });
  }

  async create(data: ServicesRequestDto): Promise<Services> {
    return await this.prismaService.services.create({
      data: {
        barbershopId: data.barbershopId,
        name: data.name,
        description: data.description,
        price: data.price,
      },
    });
  }

  async remove(id: number): Promise<Services> {
    return await this.prismaService.services.delete({
      where: { id: id },
    });
  }

  async update(id: number, data: ServicesUpdateDto): Promise<Services> {
    return await this.prismaService.services.update({
      where: { id: id },
      data: {
        name: data.name,
        description: data.description,
        price: data.price,
      },
    });
  }

  async findAllFromBarbershopByName(
    barbershopId: string,
    name: string,
  ): Promise<Services[]> {
    return await this.prismaService.services.findMany({
      where: {
        name: { contains: name, mode: 'insensitive' },
        barbershopId: barbershopId,
      },
    });
  }

  async getAllByBarbershop(barbershopId: string): Promise<Services[]> {
    return await this.prismaService.services.findMany({
      where: { barbershopId: barbershopId },
    });
  }
}
