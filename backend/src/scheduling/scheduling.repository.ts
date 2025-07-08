import { Injectable } from '@nestjs/common';
import { ScheduleStatus, Scheduling, Services } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { SchedulingRequestDto } from './dtos/scheduling-request.dto';
import { ISchedulingRepositoryInterface } from './interfaces/scheduling-repository.interface';
import { SchedulingUpdateDto } from './dtos/scheduling-update.dto';
import { SchedulingWithAll } from './types/scheduling-with-all.type';

@Injectable()
export class SchedulingRepository implements ISchedulingRepositoryInterface {
    constructor(private readonly prismaService: PrismaService) { }

    async create(data: SchedulingRequestDto): Promise<Scheduling> {
        const newScheduling = await this.prismaService.scheduling.create({
            data: {
                clientId: data.clientId,
                employeeId: data.employeeId,
                barbershopId: data.barbershopId,
                dateTime: data.dateTime,
                priceTotal: data.totalPrice,
                status: data.status as unknown as ScheduleStatus
            }
        })

        data.servicesIds.map(async (serviceId) => {
            await this.prismaService.servicesOnScheduling.create({
                data: {
                    schedulingId: newScheduling.id,
                    serviceId: serviceId
                }
            });
        })

        return newScheduling;
    }

    async remove(id: string): Promise<Scheduling> {
        const deletedScheduling = await this.prismaService.scheduling.delete({
            where: { id },
            include: {
                services: {
                    include: { service: true },
                },
            },
        });

        return deletedScheduling;
    }

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

    async findSchedulingById(id: string): Promise<SchedulingWithAll | null> {
        const scheduling = await this.prismaService.scheduling.findUnique({
            where: { id },
            include: {
                services: {
                    include: {
                        service: true,
                    },
                },
                employee: true,
                barbershop: true,
                client: true
            }
        });

        return scheduling;
    }

    async findAllByClientId(clientId: string): Promise<SchedulingWithAll[]> {
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
                client: true
            },
            orderBy: {
                dateTime: 'desc',
            },
        });

        return schedulings;
    }

    async findAllByClientName(name: string): Promise<SchedulingWithAll[]> {
        const client = await this.prismaService.client.findFirst({ where: { name: name } })

        const clientId = client?.id

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
                client: true
            },
            orderBy: {
                dateTime: 'desc',
            },
        });

        return schedulings;
    }

    async findAllByEmployeeId(employeeId: string): Promise<SchedulingWithAll[]> {
        const schedulings = await this.prismaService.scheduling.findMany({
            where: { employeeId },
            include: {
                services: {
                    include: {
                        service: true,
                    },
                },
                employee: true,
                barbershop: true,
                client: true
            },
            orderBy: {
                dateTime: 'desc',
            },
        });

        return schedulings;
    }

    async findAllByEmployeeName(name: string): Promise<SchedulingWithAll[]> {
        const employee = await this.prismaService.client.findFirst({ where: { name: name } })

        const employeeId = employee?.id

        const schedulings = await this.prismaService.scheduling.findMany({
            where: { employeeId },
            include: {
                services: {
                    include: {
                        service: true,
                    },
                },
                employee: true,
                barbershop: true,
                client: true
            },
            orderBy: {
                dateTime: 'desc',
            },
        });

        return schedulings;
    }

    async findAllByBarbershopId(barbershopId: string): Promise<SchedulingWithAll[]> {
        const schedulings = await this.prismaService.scheduling.findMany({
            where: { barbershopId },
            include: {
                services: {
                    include: {
                        service: true,
                    },
                },
                employee: true,
                barbershop: true,
                client: true
            },
            orderBy: {
                dateTime: 'desc',
            },
        });

        return schedulings;
    }

    findAllByBarbershopIdAndIntervalOfDate(barbershopId: string, from: Date, to: Date): Promise<SchedulingWithAll[]> {
        throw new Error('Method not implemented.');
    }

    findAllByBarbershopIdAndDate(barbershopId: string, date: Date): Promise<SchedulingWithAll[]> {
        throw new Error('Method not implemented.');
    }
}
