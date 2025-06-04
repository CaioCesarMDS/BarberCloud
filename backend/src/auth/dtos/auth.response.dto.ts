import { Role } from '@prisma/client';

export class AuthResponseDTO {
  id!: string;
  name!: string;
  email!: string;
  role!: Role;
  token!: string;
}
