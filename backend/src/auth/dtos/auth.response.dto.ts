import { Role } from '@prisma/client';
import { UUID } from 'node:crypto';

export class AuthResponseDTO {
  id!: string;
  name!: string;
  phone!: string;
  email!: string;
  barbershopId!: string;
  role!: Role;
  token!: string;
}
