import { Injectable } from '@nestjs/common';
import { Services } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { ServicesRequestDto } from './dtos/services-request.dto';
import { ServicesUpdateDto } from './dtos/services-update.dto';
import { IServicesRepositoryInterface } from './interfaces/services-repository.interface';
import { ServiceWithTotal } from './types/service-popular.type';

@Injectable()
export class ServicesRepository implements IServicesRepositoryInterface {
  constructor(private readonly prismaService: PrismaService) {}

  async getQuantityOfServices(barbershopId: string): Promise<number> {
    return await this.prismaService.services.count({
      where: { barbershopId: barbershopId },
    });
  }

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

  async findServiceMostPopularByClientId(
    clientId: string,
  ): Promise<ServiceWithTotal | null> {
    const result = await this.prismaService.$queryRaw<ServiceWithTotal[]>`
			SELECT s.*, COUNT(*) AS "totalServices"
			FROM "ServicesOnScheduling" sos
			JOIN "Services" s ON s.id = sos."serviceId"
			JOIN "Scheduling" sch ON sch.id = sos."schedulingId"
			WHERE sch."clientId" = ${clientId}
			GROUP BY s.id
			ORDER BY "totalServices" DESC
			LIMIT 1;
			`;

    if (result) {
      return {
        ...result[0],
        totalServices: Number(result[0].totalServices),
      };
    } else {
      return null;
    }
  }

  async findServiceMostPopularByEmployeeId(
    employeeId: string,
  ): Promise<ServiceWithTotal | null> {
    const result = await this.prismaService.$queryRaw<ServiceWithTotal[]>`
			SELECT s.*, COUNT(*) AS "totalServices"
			FROM "ServicesOnScheduling" sos
			JOIN "Services" s ON s.id = sos."serviceId"
			JOIN "Scheduling" sch ON sch.id = sos."schedulingId"
			WHERE sch."employeeId" = ${employeeId}
			GROUP BY s.id
			ORDER BY "totalServices" DESC
			LIMIT 1;
			`;

    if (result) {
      return {
        ...result[0],
        totalServices: Number(result[0].totalServices),
      };
    } else {
      return null;
    }
  }

  async findServiceMostPopularByBarbershopId(
    barbershopId: string,
  ): Promise<ServiceWithTotal | null> {
    const result = await this.prismaService.$queryRaw<ServiceWithTotal[]>`
    SELECT s.*, COUNT(*) AS "totalServices"
    FROM "ServicesOnScheduling" sos
    JOIN "Services" s ON s.id = sos."serviceId"
    JOIN "Scheduling" sch ON sch.id = sos."schedulingId"
    WHERE sch."barbershopId" = ${barbershopId}
    GROUP BY s.id
    ORDER BY "totalServices" DESC
    LIMIT 1;
  `;

    if (result.length === 0) {
      return null;
    }

    const mostPopular = result[0];
    return {
      ...mostPopular,
      totalServices: Number(mostPopular.totalServices),
    };
  }
}
