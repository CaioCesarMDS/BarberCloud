import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Client, Employee } from '@prisma/client';
import { ClientService } from '../client/client.service';
import { RoleJwtPayload } from '../common/interfaces/jwt.payload';
import { EmployeeService } from '../employee/employee.service';
import { AuthClientResponseDTO } from './dtos/auth-client.response.dto';
import { AuthEmployeeResponseDTO } from './dtos/auth-employee.response.dto';
import { SignInDTO } from './dtos/sign-in.dto';
import { ClientSignUpDTO, EmployeeSignUpDTO } from './dtos/sign-up.dto';
import { JwtPayload } from './interfaces/jwt.payload';
import { RedisTransportService } from 'src/redis/redis-transport.service';
import { RedisTokenService } from 'src/redis/redis-token.service';
import { ForgotPasswordResponseDTO } from './dtos/forgot-password.response.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly employeeService: EmployeeService,
    private readonly clientService: ClientService,
    private readonly redisTransportService: RedisTransportService,
    private readonly redisTokenService: RedisTokenService,
  ) { }

  async clientSignUp(data: ClientSignUpDTO): Promise<AuthClientResponseDTO> {
    const newUser = await this.clientService.create(data);

    return this.buildAuthClientResponse(newUser);
  }

  async employeeSignUp(
    data: EmployeeSignUpDTO,
  ): Promise<AuthEmployeeResponseDTO> {
    const newUser = await this.employeeService.create(data);

    return this.buildAuthEmployeeResponse(newUser);
  }

  async clientSignIn(data: SignInDTO): Promise<AuthClientResponseDTO> {
    const user = await this.clientService.findByEmail(data.email);
    if (
      !user ||
      !(await this.clientService.isPasswordValid(data.password, user.password))
    ) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.buildAuthClientResponse(user);
  }

  async employeeSignIn(data: SignInDTO): Promise<AuthEmployeeResponseDTO> {
    const user = await this.employeeService.findByEmail(data.email);
    if (
      !user ||
      !(await this.employeeService.isPasswordValid(
        data.password,
        user.password,
      ))
    ) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.buildAuthEmployeeResponse(user);
  }

  async buildAuthClientResponse(user: Client): Promise<AuthClientResponseDTO> {
    const token = await this.generateClientToken(user);

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      token,
    };
  }

  async buildAuthEmployeeResponse(
    user: Employee,
  ): Promise<AuthEmployeeResponseDTO> {
    const token = await this.generateEmployeeToken(user);

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      token,
    };
  }

  async verifyCode(email: string, code: string): Promise<ForgotPasswordResponseDTO> {
    const can: boolean | null = await this.verifyRedisToken(email, code);
    if (can) {
      return {
        email: email,
        tokenIsTrue: can
      }
    } else {
      throw new BadRequestException('Code is Invalid!')
    }
  }

  async sendResetPasswordCode(email: string): Promise<void> {
    const token = await this.generateRedisToken(email);
    const client = this.redisTransportService.getClient();

    try {
      const user = await this.employeeService.findByEmail(email);
      if (user) {
        client.emit('email.send', {
          to: email,
          subject: 'Recuperação de Senha - BarberCloud',
          text: `
          Olá, ${user.name}!\n
          Aqui está o código de recuperação de sua senha: ${token}`,
        });
      }
    } catch (error) {
      if(error instanceof BadRequestException) {
        const user = await this.clientService.findByEmail(email);
        if (user) {
          client.emit('email.send', {
            to: email,
            subject: 'Recuperação de Senha - BarberCloud',
            text: `
            Olá, ${user?.name}!\n
            Aqui está o código de recuperação de sua senha: ${token}`,
          });
        } else {
          throw new BadRequestException('Email sent is invalid!');
        }
      } else {
        throw error;
      }
    }
  }

  private async generateEmployeeToken(user: Employee): Promise<string> {
    const payload: RoleJwtPayload = {
      id: user.id,
      email: user.email,
      role: user.role,
    };
    return await this.jwtService.signAsync(payload);
  }

  private async generateClientToken(user: Client): Promise<string> {
    const payload: JwtPayload = {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
    };

    return await this.jwtService.signAsync(payload);
  }

  private async generateRedisToken(email: string): Promise<string> {
    return await this.redisTokenService.generateResetCode(email);
  }

  private async verifyRedisToken(email: string, code: string): Promise<boolean> {
    const redisToken: string | null = await this.redisTokenService.getResetCode(email);
    return redisToken === code ? true : false;
  }
}
