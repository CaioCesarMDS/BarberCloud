import { Injectable } from '@nestjs/common';
import { Scheduling } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { ISchedulingRepositoryInterface } from './interfaces/scheduling-repository.interface';
import { SchedulingRequestDto } from './dtos/scheduling-request.dto';

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
                priceTotal: data.totalPrice
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

    async update(id: string, data: SchedulingRequestDto): Promise<Scheduling | null> {
        throw new Error('Method not implemented.');
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
