import { Role } from '@prisma/client';

export interface JwtPayload {
  id: string;
  role: Role;
  iat?: number;
  exp?: number;
}
