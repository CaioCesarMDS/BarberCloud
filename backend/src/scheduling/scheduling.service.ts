import { Injectable } from '@nestjs/common';
import { SchedulingRequestDto } from './dtos/scheduling-request.dto';
import { SchedulingResponseDto } from './dtos/scheduling-response.dto';
import { SchedulingRepository } from './scheduling.repository';

@Injectable()
export class SchedulingService {
  constructor(private readonly schedulingRepository: SchedulingRepository) {}

  create(body: SchedulingRequestDto): Promise<SchedulingResponseDto> {
    return this.schedulingRepository.create(body);
  }

  async findByClientId(clientId: string) {
    return this.schedulingRepository.findByClientId(clientId);
  }
}
