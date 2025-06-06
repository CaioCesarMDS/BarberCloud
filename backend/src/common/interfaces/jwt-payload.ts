import { SystemRole } from '@prisma/client';

export interface JwtPayload {
  id: string;
  role: SystemRole;
  iat?: number;
  exp?: number;
}
