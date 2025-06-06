import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthenticatedRequest } from '../../common/interfaces/authenticated-request';
import { JwtPayload } from '../../common/interfaces/jwt-payload';

export const User = createParamDecorator(
  (data: keyof JwtPayload | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<AuthenticatedRequest>();
    const user = request.user;

    return data ? user?.[data] : user;
  },
);
