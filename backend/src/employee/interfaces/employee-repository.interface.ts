import { Employee } from '@prisma/client';
import { EmployeeUpdateDTO } from '../dtos/employee-update.dto';
import { EmployeeResponseDto } from '../dtos/employee.request.dto';
import { EmployeeWithServiceCount } from '../types/employee-service-count';

export interface IEmployeeRepositoryInterface {
  create(data: EmployeeUpdateDTO, hashedPassword: string): Promise<Employee>;
  remove(id: string): Promise<Employee>;
  update(
    id: string,
    EmployeeData: EmployeeUpdateDTO,
    hashedPassword?: string,
  ): Promise<Employee | null>;
  findAllByBarbershopIdWithServicesCount(id: string): Promise<EmployeeWithServiceCount[]>;
  findAllByName(name: string): Promise<EmployeeResponseDto[]>;
  findById(id: string): Promise<Employee | null>;
  findByEmail(email: string): Promise<Employee | null>;
  findByPhone(phone: string): Promise<Employee | null>;
}
