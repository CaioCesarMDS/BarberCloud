import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { JwtPayload } from '../common/interfaces/jwt.payload';
import { UserService } from '../users/user.service';
import { AuthResponseDTO } from './dtos/auth.response.dto';
import { SignInDTO } from './dtos/sign-in.dto';
import { SignUpDTO } from './dtos/sign-up.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  async signUp(data: SignUpDTO): Promise<AuthResponseDTO> {
    const newUser = await this.userService.create(data);

    return this.buildAuthResponse(newUser);
  }

  async signIn(data: SignInDTO): Promise<AuthResponseDTO> {
    const user = await this.userService.findByEmail(data.email);
    if (
      !user ||
      !(await this.userService.isPasswordValid(data.password, user.password))
    ) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.buildAuthResponse(user);
  }

  async buildAuthResponse(user: User): Promise<AuthResponseDTO> {
    const token = await this.generateToken(user);

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      token,
    };
  }

  private async generateToken(user: User): Promise<string> {
    const payload: JwtPayload = {
      id: user.id,
      role: user.role,
    };

    return await this.jwtService.signAsync(payload);
  }
}
