import { Injectable } from '@nestjs/common';
import { ScheduleStatus, Scheduling, Services } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { ISchedulingRepositoryInterface } from './interfaces/scheduling-repository.interface';
import { SchedulingRequestDto } from './dtos/scheduling-request.dto';
import { IServicesOnScheduling } from './interfaces/servicesOnScheduling.interface';
import { relative } from 'path';
import { SchedulingUpdateDto } from './dtos/scheduling-update.dto';

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
        return await this.prismaService.scheduling.delete({ where: { id: id } })
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

            const createRelations: { serviceId: number; schedulingId: string; }[] = relations;

            createRelations.filter((relation) => {
                if (data.servicesIds) {
                    data.servicesIds.some((id) => relation.serviceId !== id)
                }
            });

            const removeRelations: number[] = data.servicesIds

            removeRelations.filter(async (id) => relations.some((relation) => relation.serviceId !== id));

            console.log(createRelations);
            console.log(removeRelations);
        }

        return updateScheduling;
    }

    async getAllServicesBySchedulingId(id: string): Promise<Services[]> {
        const relations = await this.prismaService.servicesOnScheduling.findMany({ where: { schedulingId: id } });

        const services: Services[] = [];
        relations.map(async (rel) => {
            const service: Services | null = await this.prismaService.services.findUnique({ where: { id: rel.serviceId } });
            if (service) {
                services.push(service);
            }
        })

        return services;
    }

    async findAllByClientId(clientId: string): Promise<Scheduling[]> {
        throw new Error('Method not implemented.');
    }

    async findAllByClientName(name: string): Promise<Scheduling[]> {
        throw new Error('Method not implemented.');
    }

    async findAllByEmployeeId(EmployeeId: string): Promise<Scheduling[]> {
        throw new Error('Method not implemented.');
    }

    async findAllByEmployeeName(id: string): Promise<Scheduling[]> {
        throw new Error('Method not implemented.');
    }

    async findAllByBarbershopId(barbershopId: string): Promise<Scheduling[]> {
        throw new Error('Method not implemented.');
    }

    async findAllByBarbershopIdAndIntervalOfDate(barbershopId: string, from: Date, to: Date): Promise<Scheduling[]> {
        throw new Error('Method not implemented.');
    }

    async findAllByBarbershopIdAndDate(barbershopId: string, date: Date): Promise<Scheduling[]> {
        throw new Error('Method not implemented.');
    }
}
