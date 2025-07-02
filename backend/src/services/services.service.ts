import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ServicesRepository } from './services.repository';
import { ServicesResponseDto } from './dtos/services-response.dto';
import { ServicesRequestDto } from './dtos/services-request.dto';
import { Barbershop, Services } from '@prisma/client';
import { BarbershopRepository } from 'src/barbershop/barbershop.repository';
import { ServicesUpdateDto } from './dtos/services-update.dto';

@Injectable()
export class ServicesService {
  constructor(
    private readonly servicesRepository: ServicesRepository,
    private readonly barbershopRepository: BarbershopRepository,
  ) {}

  async createService(data: ServicesRequestDto): Promise<ServicesResponseDto> {
    try {
      const barbershop: Barbershop | null =
        await this.barbershopRepository.findById(data.barbershopId);
      if (barbershop) {
        const service: Services | null =
          await this.servicesRepository.create(data);
        if (service) {
          return new ServicesResponseDto(service);
        } else {
          throw new InternalServerErrorException('Error in create service');
        }
      } else {
        throw new BadRequestException('Barbershop id is invalid!');
      }
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(error, 'Error in create service');
    }
  }

  async getServiceById(id: number): Promise<ServicesResponseDto> {
    try {
      const service: Services | null =
        await this.servicesRepository.findById(id);
      if (service) {
        return new ServicesResponseDto(service);
      } else {
        throw new BadRequestException('Service Id is invalid!');
      }
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(error, 'Error in create service');
    }
  }

  async updateService(
    id: number,
    data: ServicesUpdateDto,
  ): Promise<ServicesResponseDto> {
    try {
      const service: Services | null =
        await this.servicesRepository.findById(id);
      if (service) {
        return new ServicesResponseDto(
          await this.servicesRepository.update(id, data),
        );
      } else {
        throw new BadRequestException('Service Id is invalid!');
      }
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(error, 'Error in create service');
    }
  }

  async removeService(id: number): Promise<any> {
    try {
      const service: Services | null =
        await this.servicesRepository.findById(id);
      if (service) {
        this.servicesRepository.remove(id);
        return {
          sucess: true,
          message: 'Service has been removed with successfully!',
        };
      } else {
        throw new BadRequestException('Service Id is invalid!');
      }
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(error, 'Error in create service');
    }
  }

  async findAllFromBarbershopByName(
    barbershopId: string,
    name: string,
  ): Promise<ServicesResponseDto[]> {
    try {
      const barbershop: Barbershop | null =
        await this.barbershopRepository.findById(barbershopId);
      if (barbershop) {
        const services: Services[] | null =
          await this.servicesRepository.findAllFromBarbershopByName(
            barbershopId,
            name,
          );
        if (services) {
          return services.map((s) => new ServicesResponseDto(s));
        } else {
          throw new BadRequestException('Not found!');
        }
      } else {
        throw new BadRequestException('Barbershop id is invalid!');
      }
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(error, 'Error in create service');
    }
  }

  async getAllByBarbershopId(
    barbershopId: string,
  ): Promise<ServicesResponseDto[]> {
    try {
      const barbershop: Barbershop | null =
        await this.barbershopRepository.findById(barbershopId);
      if (barbershop) {
        const services: Services[] | null =
          await this.servicesRepository.getAllByBarbershop(barbershopId);
        if (services) {
          return services.map((s) => new ServicesResponseDto(s));
        } else {
          throw new BadRequestException('Not found!');
        }
      } else {
        throw new BadRequestException('Barbershop id is invalid!');
      }
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(error, 'Error in create service');
    }
  }
}
