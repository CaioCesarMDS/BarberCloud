import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthenticatedRequest } from './interfaces/authenticated.request';
import { JwtPayload } from './interfaces/jwt.payload';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) { }

  private extractTokenFromHeader(
    request: AuthenticatedRequest,
  ): string | undefined {
    const [type, token] = request.headers['authorization']?.split(' ') ?? [];

    return type === 'Bearer' ? token : undefined;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();

    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('Access token is missing or malformed.');
    }

    try {
      const payload: JwtPayload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });

      const method: string = context.switchToHttp().getRequest().method;
      // const handler: string = context.getHandler().name;                       

      if (method === 'POST' || method === 'PUT' || method === 'DELETE') {
        if (payload.role === 'ADMIN' || payload.role === 'BARBER') {
          request.user = payload;
          return true;
        } else {
          throw new UnauthorizedException('User not have authority.');
        }
      } else {
        return true;
      }
    } catch (error) {
      if (error instanceof Error) {
        console.log('Erro:', error.name);
        console.log('Mensagem:', error.message);
      }
      if (error instanceof UnauthorizedException) {
        throw error
      } else {
        throw new UnauthorizedException('Invalid or expired access token.');
      }
    }
  }
}
