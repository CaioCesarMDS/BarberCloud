import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Barbershop, Services } from '@prisma/client';
import { BarbershopRepository } from 'src/barbershop/barbershop.repository';
import { ServicesRequestDto } from './dtos/services-request.dto';
import { ServicesResponseDto } from './dtos/services-response.dto';
import { ServicesUpdateDto } from './dtos/services-update.dto';
import { ServicesRepository } from './services.repository';

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
      throw new InternalServerErrorException(
        error,
        'Error in find service by Id.',
      );
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
      throw new InternalServerErrorException(error, 'Error in update service');
    }
  }

  async removeService(id: number): Promise<Services> {
    try {
      const service: Services | null =
        await this.servicesRepository.findById(id);
      if (service) {
        const removeService = await this.servicesRepository.remove(id);
        return removeService;
      } else {
        throw new BadRequestException('Service Id is invalid!');
      }
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(error, 'Error in delete service');
    }
  }

  async getCountTotalServices(barbershopId: string): Promise<number> {
    try {
      const barbershop: Barbershop | null =
        await this.barbershopRepository.findById(barbershopId);
      if (barbershop) {
        const totalServices: number | null =
          await this.servicesRepository.getQuantityOfServices(barbershopId);
        return totalServices;
      } else {
        throw new BadRequestException('barbershopId is invalid!');
      }
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(error, 'Error in count services');
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
      throw new InternalServerErrorException(
        error,
        'Error in find services by name from barbershop',
      );
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
      throw new InternalServerErrorException(
        error,
        'Error in find all by barbershop Id',
      );
    }
  }
}
