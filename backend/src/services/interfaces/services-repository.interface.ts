import { Services } from '@prisma/client';
import { ServicesRequestDto } from '../dtos/services-request.dto';
import { ServicesUpdateDto } from '../dtos/services-update.dto';

export interface IServicesRepositoryInterface {
  create(data: ServicesRequestDto): Promise<Services>;
  remove(id: number): Promise<Services>;
  update(id: number, data: ServicesUpdateDto): Promise<Services>;
  findAllFromBarbershopByName(
    barbershopId: string,
    name: string,
  ): Promise<Services[]>;
  getAllByBarbershop(barbershopId: string): Promise<Services[]>;
  findById(id: number): Promise<Services | null>;
  getQuantityOfServices(barbershopId: string): Promise<number>;
}
