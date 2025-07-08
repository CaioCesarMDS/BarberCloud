import { Injectable } from '@nestjs/common';
import { ScheduleStatus, Scheduling, Services } from '@prisma/client';
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

    async update(id: string, data: SchedulingUpdateDto): Promise<Scheduling> {
        const updateScheduling = await this.prismaService.scheduling.update({
            where: { id: id }, data: {
                dateTime: data.dateTime,
                status: data.status as unknown as ScheduleStatus
            }
        })

        if (data.servicesIds) {
            const relations: { serviceId: number; schedulingId: string; }[] = await this.prismaService.servicesOnScheduling
                .findMany({ where: { schedulingId: updateScheduling.id } });

            const removeRelations = relations.filter((relation) => !data.servicesIds?.includes(relation.serviceId));

            const createRelations = data.servicesIds.filter((id) => !relations.some((relation) => id === relation.serviceId));
            
            await Promise.all(removeRelations.map(async (removeRelation) => { await this.prismaService.servicesOnScheduling.delete({ where: { serviceId_schedulingId: { serviceId: removeRelation.serviceId, schedulingId: id } } }) }))

            await Promise.all(createRelations.map(async (createRelationId) => { await this.prismaService.servicesOnScheduling.create({ data: { schedulingId: id, serviceId: createRelationId } }) }))
        }

        return updateScheduling;
    }

    async getAllServicesBySchedulingId(id: string): Promise<Services[]> {
        const relations = await this.prismaService.servicesOnScheduling.findMany({ where: { schedulingId: id } });
        const services: Services[] = [];
        await Promise.all(relations.map(async (rel) => {
            const service: Services | null = await this.prismaService.services.findUnique({ where: { id: rel.serviceId } });
            if (service) {
                services.push(service);
            }
        }));

        return services;
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
