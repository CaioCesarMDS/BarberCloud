import { Role } from '@prisma/client';

export interface JwtPayload {
  id: string;
  name: string;
  email: string;
  phone: string;
  birth?: string;
  barbershopId: string;
  role: Role;
  iat?: number;
  exp?: number;
}
