import { Role } from '@prisma/client';

export class AuthResponseDTO {
  id!: string;
  name!: string;
  phone!: string;
  email!: string;
  role!: Role;
  token!: string;
}
