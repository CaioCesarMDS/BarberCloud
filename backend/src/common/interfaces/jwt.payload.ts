import { Role } from '@prisma/client';

export interface RoleJwtPayload {
  id: string;
  email: string;
  role: Role;
  iat?: number;
  exp?: number;
}
