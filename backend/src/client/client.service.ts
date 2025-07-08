import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Barbershop, Client, ClientSubscribeBarbershop } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { RedisTransportService } from 'src/redis/redis-transport.service';
import { ClientRepository } from './client.repository';
import { CreateClientDTO } from './dtos/client-create.dto';
import { ClientDetailsDto } from './dtos/client-details.dto';
import { ClientUpdateDTO } from './dtos/client-update.dto';
import { ClientResponseDto } from './dtos/client.response.dto';
import { BarbershopRepository } from 'src/barbershop/barbershop.repository';

@Injectable()
export class ClientService {
  constructor(
    private readonly clientRepository: ClientRepository,
    private readonly barbershopRepository: BarbershopRepository,
    private readonly redisTransportService: RedisTransportService,
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
    if (clientData.password) {
      const hashedPassword: string = await this.hashPassword(
        clientData.password,
      );
      const clientUpdated: Client | null = await this.clientRepository.update(
        id,
        clientData,
        hashedPassword,
      );
      return clientUpdated ? new ClientResponseDto(clientUpdated) : null;
    } else {
      const clientUpdated: Client | null = await this.clientRepository.update(
        id,
        clientData,
      );
      return clientUpdated ? new ClientResponseDto(clientUpdated) : null;
    }
  }

  async findAllByName(name: string): Promise<ClientResponseDto[]> {
    try {
      const clients: Client[] | null =
        await this.clientRepository.findAllByName(name);
      if (clients) {
        return clients.map((Client) => new ClientResponseDto(Client));
      } else {
        throw new BadRequestException(`Clients with name ${name}'s not found!`);
      }
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(
        error,
        'Error in find clients by name!',
      );
    }
  }

  async findById(id: string): Promise<ClientResponseDto> {
    try {
      const client: Client | null = await this.clientRepository.findById(id);
      if (client) {
        return new ClientResponseDto(client);
      } else {
        throw new BadRequestException('Client Not Found!');
      }
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(
        error,
        'Error in find client by id!',
      );
    }
  }

  async findDetailsById(id: string): Promise<ClientDetailsDto> {
    try {
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
        throw new BadRequestException('Client or Barbershop Id is invalid!');
      }
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(
        error,
        'Error in find client details by id!',
      );
    }
  }

  async findByEmail(email: string): Promise<Client> {
    try {
      const client: Client | null =
        await this.clientRepository.findByEmail(email);
      if (client) {
        return client;
      } else {
        throw new BadRequestException('User not Found!');
      }
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(
        error,
        'Error in find client by email!',
      );
    }
  }

  async subscribeInBarbershop(
    clientId: string,
    barbershopId: string,
  ): Promise<ClientDetailsDto> {
    try {
      const barbershop: Barbershop | null =
        await this.barbershopRepository.findById(barbershopId);
      const client: Client | null =
        await this.clientRepository.findById(clientId);
      if (client && barbershop) {
        const subscription: ClientSubscribeBarbershop | null =
          await this.clientRepository.findSubscription(clientId, barbershopId);
        if (subscription) {
          throw new BadRequestException(
            'Subscription in this barbershop exists!',
          );
        } else {
          await this.clientRepository.subscribeInBarbershop(
            clientId,
            barbershopId,
          );
          return await this.findDetailsById(clientId);
        }
      } else {
        throw new BadRequestException('Client or Barbershop Id is invalid!');
      }
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(
        error,
        'Error in client subscribe to barbershop!',
      );
    }
  }

  async unSubscribeInBarbershop(
    clientId: string,
    barbershopId: string,
  ): Promise<ClientDetailsDto> {
    try {
      const barbershop: Barbershop | null =
        await this.barbershopRepository.findById(barbershopId);
      const client: Client | null =
        await this.clientRepository.findById(clientId);
      if (client && barbershop) {
        const subscription: ClientSubscribeBarbershop | null =
          await this.clientRepository.findSubscription(clientId, barbershopId);
        if (subscription) {
          await this.clientRepository.unSubscribeInBarbershop(
            clientId,
            barbershopId,
          );
          return await this.findDetailsById(clientId);
        } else {
          throw new BadRequestException(
            'Subscription in this barbershop not exists!',
          );
        }
      } else {
        throw new BadRequestException('Client or Barbershop Id is invalid!');
      }
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(
        error,
        'Error in client unsubscribe to barbershop!',
      );
    }
  }

  hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  isPasswordValid(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}
