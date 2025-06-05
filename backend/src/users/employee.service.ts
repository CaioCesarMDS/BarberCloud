import { Injectable } from '@nestjs/common';
import { Employee } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { CreateEmployeeDTO } from './dtos/create-employee.dto';
import { EmployeeUpdateDTO } from './dtos/employee-update.dto';
import { EmployeeResponseDto } from './dtos/employee.request.dto';
import { EmployeeRepository } from './employee.repository';

@Injectable()
export class EmployeeService {
  constructor(private readonly employeeRepository: EmployeeRepository) {}

  async create(data: CreateEmployeeDTO): Promise<Employee> {
    const hashedPassword = await this.hashPassword(data.password);
    return this.employeeRepository.create(data, hashedPassword);
  }

  remove(id: string): Promise<Employee> {
    return this.employeeRepository.remove(id);
  }

  update(id: string, EmployeeData: EmployeeUpdateDTO): Promise<Employee | null> {
    return this.employeeRepository.update(id, EmployeeData);
  }

  findAllByName(name: string): Promise<EmployeeResponseDto[]> {
    return this.employeeRepository.findAllByName(name);
  }

  findById(id: string): Promise<Employee | null> {
    return this.employeeRepository.findById(id);
  }

  findByEmail(email: string): Promise<Employee | null> {
    return this.employeeRepository.findByEmail(email);
  }

  hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  isPasswordValid(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}
