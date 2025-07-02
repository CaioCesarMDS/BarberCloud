import { Injectable } from '@nestjs/common';
import { BadRequestException } from '@nestjs/common/exceptions/bad-request.exception';
import { Employee } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { RedisTransportService } from 'src/redis/redis-transport.service';
import { CreateEmployeeDTO } from './dtos/create-employee.dto';
import { EmployeeUpdateDTO } from './dtos/employee-update.dto';
import { EmployeeResponseDto } from './dtos/employee.request.dto';
import { EmployeeRepository } from './employee.repository';

@Injectable()
export class EmployeeService {
  constructor(
    private readonly employeeRepository: EmployeeRepository,
    private redisTransportService: RedisTransportService,
  ) {}

  async create(data: CreateEmployeeDTO): Promise<Employee> {
    const hashedPassword = await this.hashPassword(data.password);

    const newEmployee = await this.employeeRepository.create(
      data,
      hashedPassword,
    );

    if (!newEmployee) {
      throw new BadRequestException('Error creating employee');
    }

    const client = this.redisTransportService.getClient();

    client.emit('email.send', {
      to: newEmployee.email,
      subject: 'Cadastro realizado',
      text: `Seja bem-vindo, ${newEmployee.name}!`,
    });

    return newEmployee;
  }

  remove(id: string): Promise<Employee> {
    return this.employeeRepository.remove(id);
  }

  async update(
    id: string,
    EmployeeData: EmployeeUpdateDTO,
  ): Promise<EmployeeResponseDto | null> {
    if (EmployeeData.password) {
      const hashedPassword: string = await this.hashPassword(
        EmployeeData.password,
      );
      const employeeUpdated: Employee | null =
        await this.employeeRepository.update(id, EmployeeData, hashedPassword);
      return employeeUpdated ? new EmployeeResponseDto(employeeUpdated) : null;
    } else {
      const employeeUpdated: Employee | null =
        await this.employeeRepository.update(id, EmployeeData);
      return employeeUpdated ? new EmployeeResponseDto(employeeUpdated) : null;
    }
  }

  findAllByName(name: string): Promise<EmployeeResponseDto[]> {
    return this.employeeRepository.findAllByName(name);
  }

  findById(id: string): Promise<Employee | null> {
    return this.employeeRepository.findById(id);
  }

  async findByEmail(email: string): Promise<Employee> {
    const employee: Employee | null =
      await this.employeeRepository.findByEmail(email);
    if (employee) {
      return employee;
    } else {
      throw new BadRequestException('User Not Found');
    }
  }

  hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  isPasswordValid(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}
