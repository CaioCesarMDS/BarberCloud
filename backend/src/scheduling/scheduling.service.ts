import { BadRequestException, Injectable } from '@nestjs/common';
import { SchedulingRepository } from './scheduling.repository';
import { SchedulingResponseDto } from './dtos/scheduling-response.dto';
import { SchedulingRequestDto } from './dtos/scheduling-request.dto';
import { Scheduling, Services } from '@prisma/client';
import { SchedulingUpdateDto } from './dtos/scheduling-update.dto';
import { SchedulingWithAll } from './types/scheduling-with-all.type';

@Injectable()
export class SchedulingService {
    constructor(
        private readonly schedulingRepository: SchedulingRepository
    ) { }

    async create(data: SchedulingRequestDto): Promise<SchedulingResponseDto> {
        try {
            const scheduling: Scheduling = await this.schedulingRepository.create(data);
            return this.findScheduleById(scheduling.id);
        } catch (error) {
            throw new BadRequestException(error, 'error in create a new scheduling')
        }
    }

    async findScheduleById(id: string): Promise<SchedulingResponseDto> {
        try {
            const scheduling: SchedulingWithAll | null = await this.schedulingRepository.findSchedulingById(id);
            if (scheduling) {
                return new SchedulingResponseDto(scheduling);
            } else {
                throw new BadRequestException('scheduling not found')
            }
        } catch (error) {
            throw new BadRequestException(error, 'error in find scheduling')
        }

    }

    async update(id: string, data: SchedulingUpdateDto): Promise<SchedulingResponseDto> {
        try {
            const schedulingUpdate: Scheduling | null = await this.schedulingRepository.update(id, data);
            return this.findScheduleById(schedulingUpdate.id);
        } catch (error) {
            throw new BadRequestException(error, 'error in update a new scheduling')
        }
    }

    async delete(id: string): Promise<Scheduling> {
        try {
            const schedulingDeleted: Scheduling | null = await this.schedulingRepository.remove(id);
            return schedulingDeleted;
        } catch (error) {
            throw new BadRequestException(error, 'error in update a new scheduling')
        }
    }

    async findAllByClientId(clientId: string): Promise<SchedulingResponseDto[]> {
        try {
            const schedulings: SchedulingWithAll[] = await this.schedulingRepository.findAllByClientId(clientId);

            if (schedulings) {
                return schedulings.map((scheduling) => {
                    const services: Services[] = scheduling.services.map((s) => s.service);
                    return new SchedulingResponseDto(scheduling);
                });
            } else {
                throw new BadRequestException('Schedulings with clientId not found')
            }
        } catch (error) {
            throw new BadRequestException(error, 'error in find all schedulings by clientId')
        }
    }

    async findAllByClientName(name: string): Promise<SchedulingResponseDto[]> {
        try {
            const schedulings: SchedulingWithAll[] = await this.schedulingRepository.findAllByClientName(name);

            if (schedulings) {
                return schedulings.map((scheduling) => {
                    const services: Services[] = scheduling.services.map((s) => s.service);
                    return new SchedulingResponseDto(scheduling);
                });
            } else {
                throw new BadRequestException('Schedulings with client name not found')
            }
        } catch (error) {
            throw new BadRequestException(error, 'error in find all schedulings by client name')
        }
    }

    async findAllByEmployeeId(employeeId: string): Promise<SchedulingResponseDto[]> {
        try {
            const schedulings: SchedulingWithAll[] = await this.schedulingRepository.findAllByEmployeeId(employeeId);

            if (schedulings) {
                return schedulings.map((scheduling) => {
                    const services: Services[] = scheduling.services.map((s) => s.service);
                    return new SchedulingResponseDto(scheduling);
                });
            } else {
                throw new BadRequestException('Schedulings with employeeId not found')
            }
        } catch (error) {
            throw new BadRequestException(error, 'error in find all schedulings by employeeId')
        }
    }

    async findAllByEmployeeName(name: string): Promise<SchedulingResponseDto[]> {
        try {
            const schedulings: SchedulingWithAll[] = await this.schedulingRepository.findAllByEmployeeName(name);

            if (schedulings) {
                return schedulings.map((scheduling) => {
                    const services: Services[] = scheduling.services.map((s) => s.service);
                    return new SchedulingResponseDto(scheduling);
                });
            } else {
                throw new BadRequestException('Schedulings with employeeId not found')
            }
        } catch (error) {
            throw new BadRequestException(error, 'error in find all schedulings by employeeId')
        }
    }

    async findAllByBarbershopId(barbershopId: string): Promise<SchedulingResponseDto[]> {
        try {
            const schedulings: SchedulingWithAll[] = await this.schedulingRepository.findAllByBarbershopId(barbershopId);

            if (schedulings) {
                return schedulings.map((scheduling) => {
                    const services: Services[] = scheduling.services.map((s) => s.service);
                    return new SchedulingResponseDto(scheduling);
                });
            } else {
                throw new BadRequestException('Schedulings with BarbershopId not found');
            }
        } catch (error) {
            throw new BadRequestException(error, 'error in find all schedulings by BarbershopId')
        }
    }
}
