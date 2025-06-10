import { BadRequestException, Injectable } from '@nestjs/common';
import { Barbershop, Client, ClientSubscribeBarbershop } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { RedisTransportService } from 'src/redis/redis-transport.service';
import { ClientRepository } from './client.repository';
import { CreateClientDTO } from './dtos/client-create.dto';
import { ClientDetailsDto } from './dtos/client-details.dto';
import { ClientUpdateDTO } from './dtos/client-update.dto';
import { ClientResponseDto } from './dtos/client.response.dto';

@Injectable()
export class ClientService {
  constructor(
    private readonly clientRepository: ClientRepository,
    private redisTransportService: RedisTransportService,
  ) {}

  async create(data: CreateClientDTO): Promise<Client> {
    const hashedPassword = await this.hashPassword(data.password);

    const newUser = await this.clientRepository.create(data, hashedPassword);

    if (!newUser) {
      throw new BadRequestException('Error creating client');
    }

    const client = this.redisTransportService.getClient();

    client.emit('email.send', {
      to: newUser.email,
      subject: 'Cadastro realizado',
      text: `Seja bem-vindo, ${newUser.name}!`,
    });

    return newUser;
  }

  async remove(id: string): Promise<ClientResponseDto> {
    return new ClientResponseDto(await this.clientRepository.remove(id));
  }

  async update(
    id: string,
    clientData: ClientUpdateDTO,
  ): Promise<ClientResponseDto | null> {
    const clientUpdated: Client | null = await this.clientRepository.update(
      id,
      clientData,
    );
    return clientUpdated ? new ClientResponseDto(clientUpdated) : null;
  }

  async findAllByName(name: string): Promise<ClientResponseDto[]> {
    console.log(name);
    return await this.clientRepository.findAllByName(name);
  }

  async findById(id: string): Promise<ClientResponseDto> {
    const client: Client | null = await this.clientRepository.findById(id);
    if (client) {
      return new ClientResponseDto(client);
    } else {
      throw new BadRequestException('Client Not Found!');
    }
  }

  async findDetailsById(id: string): Promise<ClientDetailsDto | null> {
    const client: Client | null = await this.clientRepository.findById(id);
    const subscribeIn: ClientSubscribeBarbershop[] | null =
      await this.clientRepository.findBarbershopsSubscribeById(id);
    const barbershops: Barbershop[] = [];
    if (subscribeIn && client) {
      for (const sucribe of subscribeIn) {
        const barbershop = await this.clientRepository.findBarbershopById(
          sucribe.barbershopId,
        );
        if (barbershop) {
          barbershops.push(barbershop);
        } else {
          throw new BadRequestException('Barbershop Not Found!');
        }
      }
      return new ClientDetailsDto(client, subscribeIn, barbershops);
    } else {
      return null;
    }
  }

  findByEmail(email: string): Promise<Client | null> {
    return this.clientRepository.findByEmail(email);
  }

  hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  isPasswordValid(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}
