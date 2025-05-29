import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  ParseUUIDPipe,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Role, User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'prisma/prisma.service';
import { AuthResponseDTO } from './dtos/auth.response.dto';
import { SignInDTO } from './dtos/sign-in.dto';
import { SignUpDTO } from './dtos/sign-up.dto';
import { JwtPayload } from './interfaces/jwt.payload';
import { randomUUID } from 'node:crypto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(data: SignUpDTO): Promise<AuthResponseDTO> {
    // const emailInUse = await this.findByEmail(data.email);
    // if (emailInUse) throw new ConflictException('Email already in use');

    const user = await this.createUser(data);
    if (!user) throw new InternalServerErrorException('Failed to create user');

    return this.generateAccessToken(user);
  }

  async signIn(data: SignInDTO): Promise<AuthResponseDTO> {
    const user = await this.findByEmail(data.email);
    if (!user || !(await this.isPasswordValid(data.password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.generateAccessToken(user);
  }

  private async createUser(data: SignUpDTO): Promise<User> {
    if(data.password === data.confirmPassword) {
      const hashedPassword = await bcrypt.hash(data.password, 10);
      
      return this.prismaService.user.create({
        data: {
          id: randomUUID(),
          name: data.name,
          phone: data.phone,
          birth: new Date(data.birth),
          email: data.email,
          password: hashedPassword,
          barbershopId: data.barbershopId,
          role: data.role,
        },
      });
    } else {
      throw new ConflictException("The Passwords Not Mached!");
    }
  }

  private async isPasswordValid(
    password: string,
    hash: string,
  ): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }

  async generateAccessToken(user: User): Promise<AuthResponseDTO> {
    const payload: JwtPayload = {
      id: user.id.toString(),
      name: user.name,
      phone: user.phone,
      birth: user.birth?.toString(),
      email: user.email,
      barbershopId: user.barbershopId,
      role: user.role
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
      birth: user.birth?.toString(),
      barbershopId: user.barbershopId,
      role: user.role,
      token,
    };
  }

  async findByEmail(email: string) {
    return this.prismaService.user.findUnique({ where: { email: email } });
  }

  async findByPhone(phone: string) {
    return this.prismaService.user.findUnique({ where: { phone: phone } });
  }
}
