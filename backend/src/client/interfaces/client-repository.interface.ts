import { Barbershop, Client, ClientSubscribeBarbershop } from '@prisma/client';
import { ClientUpdateDTO } from '../dtos/client-update.dto';
import { CreateClientDTO } from '../dtos/client-create.dto';

export interface IClientRepositoryInterface {
  create(data: CreateClientDTO, hashedPassword: string): Promise<Client>;
  remove(id: string): Promise<Client>;
  update(
    id: string,
    ClientData: ClientUpdateDTO,
    hashedPassword?: string,
  ): Promise<Client | null>;
  findAllByName(name: string): Promise<Client[]>;
  findById(id: string): Promise<Client | null>;
  findBarbershopsSubscribeById(
    id: string,
  ): Promise<ClientSubscribeBarbershop[] | null>;
  findBarbershopById(id: string): Promise<Barbershop | null>;
  findByEmail(email: string): Promise<Client | null>;
  findByPhone(phone: string): Promise<Client | null>;
  findSubscription(
    clientId: string,
    BarbershopId: string,
  ): Promise<ClientSubscribeBarbershop | null>;
  subscribeInBarbershop(
    clientId: string,
    BarbershopId: string,
  ): Promise<ClientSubscribeBarbershop>;
  unSubscribeInBarbershop(
    clientId: string,
    BarbershopId: string,
  ): Promise<ClientSubscribeBarbershop>;
}
