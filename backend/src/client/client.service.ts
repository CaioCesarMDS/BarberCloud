import { Injectable } from '@nestjs/common';
import { Barbershop, Client, ClientSubscribeBarbershop } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { CreateClientDTO } from './dtos/client-create.dto';
import { ClientUpdateDTO } from './dtos/client-update.dto';
import { ClientResponseDto } from './dtos/client.response.dto';
import { ClientRepository } from './client.repository';
import { ClientDetailsDto } from './dtos/client-details.dto';

@Injectable()
export class ClientService {
  constructor(private readonly clientRepository: ClientRepository) {}

  async create(data: CreateClientDTO): Promise<Client> {
    const hashedPassword = await this.hashPassword(data.password);
    return this.clientRepository.create(data, hashedPassword);
  }

  async remove(id: string): Promise<ClientResponseDto> {
    return new ClientResponseDto(await this.clientRepository.remove(id))
  }

  async update(id: string, clientData: ClientUpdateDTO): Promise<ClientResponseDto | null> {
    const clientUpdated: Client | null = await this.clientRepository.update(id, clientData);
    return clientUpdated? new ClientResponseDto(clientUpdated): null;
  }

  findAllByName(name: string): Promise<ClientResponseDto[]> {
    return this.clientRepository.findAllByName(name);
  }

  findById(id: string): Promise<Client | null> {
    return this.clientRepository.findById(id);
  }

  async findDetailsById(id: string): Promise<ClientDetailsDto | null> {
    const client: Client | null = await this.findById(id);
    const subscribeIn: ClientSubscribeBarbershop[] | null = await this.clientRepository.findBarbershopsSubscribeById(id);
    const barbershops: any = [];
    if(subscribeIn && client) {
      subscribeIn.map((sucribe) => {
        barbershops.push(this.clientRepository.findBarbershopById(sucribe.barbershopId));
      });
      return new ClientDetailsDto(client, subscribeIn, barbershops)
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
