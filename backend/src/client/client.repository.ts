import { Injectable } from '@nestjs/common';
import { Barbershop, Client, ClientSubscribeBarbershop } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { CreateClientDTO } from './dtos/client-create.dto';
import { ClientUpdateDTO } from './dtos/client-update.dto';
import { IClientRepositoryInterface } from './interfaces/client-repository.interface';

@Injectable()
export class ClientRepository implements IClientRepositoryInterface {
  constructor(private readonly prismaService: PrismaService) {}

  async create(data: CreateClientDTO, hashedPassword: string): Promise<Client> {
    return await this.prismaService.client.create({
      data: {
        name: data.name,
        phone: data.phone,
        birth: data.birth,
        email: data.email,
        password: hashedPassword,
      },
    });
  }

  remove(id: string): Promise<Client> {
    return this.prismaService.client.delete({ where: { id: id } });
  }

  update(
    id: string,
    data: ClientUpdateDTO,
    hashedPassword?: string,
  ): Promise<Client | null> {
    return this.prismaService.client.update({
      where: { id: id },
      data: {
        name: data.name,
        phone: data.phone,
        birth: data.birth,
        email: data.email,
        password: hashedPassword,
      },
    });
  }

  async findAllByName(name: string): Promise<Client[]> {
    return await this.prismaService.client.findMany({
      where: { name: { contains: name, mode: 'insensitive' } },
    });
  }

  findById(id: string): Promise<Client | null> {
    return this.prismaService.client.findUnique({ where: { id: id } });
  }

  async findBarbershopsSubscribeById(
    id: string,
  ): Promise<ClientSubscribeBarbershop[] | null> {
    return await this.prismaService.clientSubscribeBarbershop.findMany({
      where: { clientId: id },
    });
  }

  async findBarbershopById(id: string): Promise<Barbershop | null> {
    return await this.prismaService.barbershop.findUnique({
      where: { id: id },
    });
  }

  async findByEmail(email: string): Promise<Client | null> {
    return await this.prismaService.client.findUnique({
      where: { email: email },
    });
  }

  async findByPhone(phone: string): Promise<Client | null> {
    return await this.prismaService.client.findUnique({
      where: { phone: phone },
    });
  }

  async findSubscription(
    clientId: string,
    barbershopId: string,
  ): Promise<ClientSubscribeBarbershop | null> {
    return await this.prismaService.clientSubscribeBarbershop.findUnique({
      where: { clientId_barbershopId: { clientId, barbershopId } },
    });
  }

  async subscribeInBarbershop(
    clientId: string,
    barbershopId: string,
  ): Promise<ClientSubscribeBarbershop> {
    return await this.prismaService.clientSubscribeBarbershop.create({
      data: { clientId: clientId, barbershopId: barbershopId },
    });
  }

  async unSubscribeInBarbershop(
    clientId: string,
    barbershopId: string,
  ): Promise<ClientSubscribeBarbershop> {
    return await this.prismaService.clientSubscribeBarbershop.delete({
      where: { clientId_barbershopId: { clientId, barbershopId } },
    });
  }
}
