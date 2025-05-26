import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthenticatedRequest } from './interfaces/authenticated.request';
import { JwtPayload } from './interfaces/jwt.payload';
import { AuthResponseDto } from './dtos/authResponse.dto';
import { User } from '@prisma/client';
require("dotenv").config();

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService
  ) { }

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

      request.user = payload;

      return true;
    } catch {
      throw new UnauthorizedException('Invalid or expired access token.');
    }
  }

  async generateAccessToken(user: User): Promise<AuthResponseDto> {
    const token = this.jwtService.signAsync({
      name: user.name,
      email: user.email,
      role: user.role
    },
      {
        expiresIn: "3h",
        privateKey: process.env.JWT_SECRET
      });
    
    return ({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: (await token.then()).toString()
    }); 
  }
}