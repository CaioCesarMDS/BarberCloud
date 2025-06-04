import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { UserService } from '../users/user.service';
import { AuthResponseDTO } from './dtos/auth.response.dto';
import { SignInDTO } from './dtos/sign-in.dto';
import { SignUpDTO } from './dtos/sign-up.dto';
import { JwtPayload } from './interfaces/jwt.payload';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  async signUp(data: SignUpDTO): Promise<AuthResponseDTO> {
    const newUser = await this.userService.createUser(data);

    return this.generateAccessToken(newUser);
  }

  async signIn(data: SignInDTO): Promise<AuthResponseDTO> {
    const user = await this.userService.findUser(data.email);
    if (
      !user ||
      !(await this.userService.isPasswordValid(data.password, user.password))
    ) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.generateAccessToken(user);
  }

  async generateAccessToken(user: User): Promise<AuthResponseDTO> {
    const payload: JwtPayload = {
      id: user.id.toString(),
      name: user.name,
      phone: user.phone,
      email: user.email,
    };

    const token = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: '3h',
    });

    return {
      id: user.id,
      name: user.name,
      phone: user.phone,
      email: user.email,
      role: user.role,
      token,
    };
  }
}
