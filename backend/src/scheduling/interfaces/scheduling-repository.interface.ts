import { SchedulingRequestDto } from '../dtos/scheduling-request.dto';
import { SchedulingResponseDto } from '../dtos/scheduling-response.dto';

export interface ISchedulingRepositoryInterface {
  create(data: SchedulingRequestDto): Promise<SchedulingResponseDto>;
  remove(id: string): Promise<SchedulingResponseDto>;
  update(
    id: string,
    data: SchedulingRequestDto,
  ): Promise<SchedulingResponseDto | null>;
  findByClientId(clientId: string): Promise<SchedulingResponseDto[]>;
}
