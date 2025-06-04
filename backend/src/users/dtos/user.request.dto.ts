import { Role, User } from '@prisma/client';

export class UserResponseDto {
  readonly id!: string;
  readonly name!: string;
  readonly email!: string;
  readonly phone!: string;
  readonly birth?: string;
  readonly role!: Role;
  readonly barbershopId?: string;

  constructor(user: User) {
    this.id = user.id;
    this.name = user.name;
    this.email = user.email;
    this.birth = user.birth?.toISOString();
    this.phone = user.phone;
    this.role = user.role;
    this.barbershopId = user.barbershopId;
  }
}
