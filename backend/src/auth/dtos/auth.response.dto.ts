import { SystemRole } from '@prisma/client';

export class AuthResponseDTO {
  id!: string;
  name!: string;
  email!: string;
  role!: SystemRole;
  token!: string;
}
