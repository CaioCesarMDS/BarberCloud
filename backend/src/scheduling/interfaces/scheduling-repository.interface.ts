
import { Scheduling, Services } from '@prisma/client';
import { SchedulingRequestDto } from '../dtos/scheduling-request.dto';
import { SchedulingUpdateDto } from '../dtos/scheduling-update.dto';
import { SchedulingWithAll } from '../types/scheduling-with-all.type';

export interface ISchedulingRepositoryInterface {
    create(data: SchedulingRequestDto): Promise<Scheduling>;
    update(id: string, data: SchedulingUpdateDto): Promise<Scheduling>;
    remove(id: string): Promise<Scheduling>;
    findSchedulingById(id: string): Promise<SchedulingWithAll | null>
    getAllServicesBySchedulingId(id: string): Promise<Services[]>
    findAllByClientId(clientId: string): Promise<SchedulingWithAll[]>;
    findAllByClientName(name: string): Promise<SchedulingWithAll[]>;
    findAllByEmployeeId(EmployeeId: string): Promise<SchedulingWithAll[]>;
    findAllByEmployeeName(id: string): Promise<SchedulingWithAll[]>;
    findAllByBarbershopId(barbershopId: string): Promise<SchedulingWithAll[]>;
    findAllByBarbershopIdAndIntervalOfDate(barbershopId: string, from: Date, to: Date): Promise<SchedulingWithAll[]>;
}
