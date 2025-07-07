import { Injectable } from '@nestjs/common';
import { Services } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { SchedulingRequestDto } from './dtos/scheduling-request.dto';
import { SchedulingResponseDto } from './dtos/scheduling-response.dto';
import { ISchedulingRepositoryInterface } from './interfaces/scheduling-repository.interface';

@Injectable()
export class SchedulingRepository implements ISchedulingRepositoryInterface {
  constructor(private readonly prismaService: PrismaService) {}

  async create(data: SchedulingRequestDto): Promise<SchedulingResponseDto> {
    const newScheduling = await this.prismaService.scheduling.create({
      data: {
        clientId: data.clientId,
        employeeId: data.employeeId,
        barbershopId: data.barbershopId,
        dateTime: data.dateTime,
        priceTotal: data.totalPrice,
        status: 'PENDING',
      },
    });

    await this.prismaService.servicesOnScheduling.createMany({
      data: data.servicesIds.map((serviceId) => ({
        schedulingId: newScheduling.id,
        serviceId,
      })),
    });

    const services = await this.prismaService.services.findMany({
      where: { id: { in: data.servicesIds } },
    });

    return new SchedulingResponseDto(newScheduling, services);
  }

  async remove(id: string): Promise<SchedulingResponseDto> {
    const deletedScheduling = await this.prismaService.scheduling.delete({
      where: { id },
      include: {
        services: {
          include: { service: true },
        },
      },
    });

    const services = deletedScheduling.services.map((s) => s.service);
    return new SchedulingResponseDto(deletedScheduling, services);
  }

  async update(
    id: string,
    data: SchedulingRequestDto,
  ): Promise<SchedulingResponseDto | null> {
    await this.prismaService.servicesOnScheduling.deleteMany({
      where: { schedulingId: id },
    });

    const updatedScheduling = await this.prismaService.scheduling.update({
      where: { id },
      data: {
        clientId: data.clientId,
        employeeId: data.employeeId,
        barbershopId: data.barbershopId,
        dateTime: data.dateTime,
        priceTotal: data.totalPrice,
      },
    });

    await this.prismaService.servicesOnScheduling.createMany({
      data: data.servicesIds.map((serviceId) => ({
        schedulingId: updatedScheduling.id,
        serviceId,
      })),
    });

    const services = await this.prismaService.services.findMany({
      where: { id: { in: data.servicesIds } },
    });

    return new SchedulingResponseDto(updatedScheduling, services);
  }

  async findByClientId(clientId: string): Promise<SchedulingResponseDto[]> {
    const schedulings = await this.prismaService.scheduling.findMany({
      where: { clientId },
      include: {
        services: {
          include: {
            service: true,
          },
        },
        employee: true,
        barbershop: true,
      },
      orderBy: {
        dateTime: 'desc',
      },
    });

    return schedulings.map((scheduling) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
      const services: Services[] = scheduling.services.map((s) => s.service);
      return new SchedulingResponseDto(scheduling, services);
    });
  }
}
