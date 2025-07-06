import { Scheduling } from '@prisma/client';
import { SchedulingRequestDto } from '../dtos/scheduling-request.dto';

export interface ISchedulingRepositoryInterface {
    create(data: SchedulingRequestDto): Promise<Scheduling>;
    remove(id: string): Promise<Scheduling>;
    update(id: string, data: SchedulingRequestDto): Promise<Scheduling | null>;
    findAllByClientId(clientId: string): Promise<Scheduling[]>;
    findAllByClientName(name: string): Promise<Scheduling[]>;
    findAllByEmployeeId(EmployeeId: string): Promise<Scheduling[]>;
    findAllByEmployeeName(id: string): Promise<Scheduling[]>;
    findAllByBarbershopId(barbershopId: string): Promise<Scheduling[]>;
    findAllByBarbershopIdAndIntervalOfDate(barbershopId: string, from: Date, to: Date): Promise<Scheduling[]>;
    findAllByBarbershopIdAndDate(barbershopId: string, date: Date): Promise<Scheduling[]>;
}
