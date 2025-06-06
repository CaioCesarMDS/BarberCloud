import { Injectable } from '@nestjs/common';
import { Barbershop } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { BarbershopCreateDto } from './dtos/barbershop-create.dto';
import { BarbershopUpdateDto } from './dtos/barbershop-update.dto';
import { IBarbershopRepository } from './interfaces/barbershop-repository.interface';

@Injectable()
export class BarbershopRepository implements IBarbershopRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(addressId: string, data: BarbershopCreateDto): Promise<Barbershop> {
    return this.prisma.barbershop.create({
      data: {
        name: data.name,
        description: data.description,
        addressId,
      },
    });
  }

  update(id: string, data: BarbershopUpdateDto): Promise<Barbershop> {
    return this.prisma.barbershop.update({
      where: { id: id },
      data: {
        name: data.name,
        description: data.description,
      },
    });
  }

  softDelete(id: string): Promise<Barbershop> {
    return this.prisma.barbershop.update({
      where: { id: id },
      data: {
        isActive: false,
      },
    });
  }

  find(id: string): Promise<Barbershop | null> {
    return this.prisma.barbershop.findUnique({
      where: { id: id },
    });
  }
}
