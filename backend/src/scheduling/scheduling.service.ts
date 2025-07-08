import { BadRequestException, Injectable } from '@nestjs/common';
import { SchedulingRepository } from './scheduling.repository';
import { SchedulingResponseDto } from './dtos/scheduling-response.dto';
import { SchedulingRequestDto } from './dtos/scheduling-request.dto';
import { Scheduling, Services } from '@prisma/client';
import { SchedulingUpdateDto } from './dtos/scheduling-update.dto';

@Injectable()
export class SchedulingService {
    constructor(
        private readonly schedulingRepository: SchedulingRepository
    ) { }

    async create(data: SchedulingRequestDto): Promise<SchedulingResponseDto> {
        try {
            const scheduling: Scheduling = await this.schedulingRepository.create(data);
            const services: Services[] = await this.schedulingRepository.getAllServicesBySchedulingId(scheduling.id);
            return new SchedulingResponseDto(scheduling, services);
        } catch (error) {
            throw new BadRequestException(error, 'error in create a new scheduling')
        }
    }

    async update(id: string, data: SchedulingUpdateDto): Promise<SchedulingResponseDto> {
        try {
            const schedulingUpdate: Scheduling | null = await this.schedulingRepository.update(id, data);
            const services: Services[] = await this.schedulingRepository.getAllServicesBySchedulingId(schedulingUpdate.id);
            return new SchedulingResponseDto(schedulingUpdate, services);
        } catch (error) {
            throw new BadRequestException(error, 'error in update a new scheduling')
        }
    }
  
  async findByClientId(clientId: string) {
    return this.schedulingRepository.findByClientId(clientId);
  }
}
