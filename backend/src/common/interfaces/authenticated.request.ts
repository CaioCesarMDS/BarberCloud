import { Request } from 'express';
import { RoleJwtPayload } from './jwt.payload';

export interface AuthenticatedRequest extends Request {
  user: RoleJwtPayload;
}
