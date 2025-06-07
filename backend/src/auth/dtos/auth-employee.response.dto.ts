import { Role } from '@prisma/client';

export class AuthEmployeeResponseDTO {
  id!: string;
  name!: string;
  email!: string;
  role!: Role;
  token!: string;
}
