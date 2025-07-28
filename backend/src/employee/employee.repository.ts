import { Injectable } from '@nestjs/common';
import { Employee, Role } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { CreateEmployeeDTO } from './dtos/create-employee.dto';
import { EmployeeUpdateDTO } from './dtos/employee-update.dto';
import { EmployeeResponseDto } from './dtos/employee.request.dto';
import { IEmployeeRepositoryInterface } from './interfaces/employee-repository.interface';
import { EmployeeWithServiceCount } from './types/employee-service-count';

@Injectable()
export class EmployeeRepository implements IEmployeeRepositoryInterface {
  constructor(private readonly prismaService: PrismaService) { }

  async findAllByBarbershopIdWithServicesCount(barbershopId: string): Promise<EmployeeWithServiceCount[]> {
    const result = await this.prismaService.$queryRaw<EmployeeWithServiceCount[]>`
      SELECT
      e.id,
      e.name,
      e.email,
      e.phone,
      e.birth,
      e."barbershopId",
      e.role,
      COUNT(s.id) AS "totalServicesRealizeds"
    FROM "Employee" e
    LEFT JOIN "Scheduling" sc ON sc."employeeId" = e.id AND sc.status = 'DONE'
    LEFT JOIN "ServicesOnScheduling" sos ON sos."schedulingId" = sc.id
    LEFT JOIN "Services" s ON s.id = sos."serviceId"
    WHERE e."barbershopId" = ${barbershopId}
    GROUP BY e.id
    ORDER BY "totalServicesRealizeds" DESC;
  `;

    if (result) {
      return result.map((rs) => ({
        ...rs,
        totalServicesRealizeds: Number(rs.totalServicesRealizeds),
      }));
    } else {
      return [];
    }
  }

  create(data: CreateEmployeeDTO, hashedPassword: string): Promise<Employee> {
    return this.prismaService.employee.create({
      data: {
        name: data.name,
        phone: data.phone,
        birth: data.birth,
        email: data.email,
        password: hashedPassword,
        role: data.role as unknown as Role,
        barbershopId: data.barbershopId,
      },
    });
  }

  remove(id: string): Promise<Employee> {
    return this.prismaService.employee.delete({ where: { id: id } });
  }

  async update(
    id: string,
    data: EmployeeUpdateDTO,
    hashedPassword?: string,
  ): Promise<Employee | null> {
    return this.prismaService.employee.update({
      where: { id: id },
      data: {
        name: data.name,
        phone: data.phone,
        birth: data.birth,
        email: data.email,
        role: data.role as unknown as Role,
        password: hashedPassword,
      },
    });
  }

  async findAllByName(name: string): Promise<EmployeeResponseDto[]> {
    const Employees = await this.prismaService.employee.findMany({
      where: { name: { contains: name, mode: 'insensitive' } },
    });

    return Employees.map((Employee) => new EmployeeResponseDto(Employee));
  }

  findById(id: string): Promise<Employee | null> {
    return this.prismaService.employee.findUnique({ where: { id: id } });
  }

  findByEmail(email: string): Promise<Employee | null> {
    return this.prismaService.employee.findUnique({
      where: { email: email },
    });
  }

  findByPhone(phone: string): Promise<Employee | null> {
    return this.prismaService.employee.findUnique({
      where: { phone: phone },
    });
  }
}
