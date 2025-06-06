import { Role, Employee } from '@prisma/client';

export class EmployeeResponseDto {
  readonly id!: string;
  readonly name!: string;
  readonly email!: string;
  readonly phone!: string;
  readonly birth?: string;
  readonly role!: Role;
  readonly barbershopId?: string;

  constructor(employee: Employee) {
    this.id = employee.id;
    this.name = employee.name;
    this.email = employee.email;
    this.birth = employee.birth?.toISOString();
    this.phone = employee.phone;
    this.role = employee.role;
    this.barbershopId = employee.barbershopId;
  }
}
