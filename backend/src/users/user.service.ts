import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { UserRequestDto } from './dtos/user.request.dto';
import { UserResponseDto } from './dtos/user.response.dto';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { UserUpdateDto } from './dtos/user.update.dto';
import { userInfo } from 'os';

@Injectable()
export class UserService {

  constructor(private prisma: PrismaService) { }

  async create(userData: UserRequestDto): Promise<UserResponseDto | null> {
    const createToken: string = '';

    if (userData.password !== userData.confirmPassword) {
      throw new BadRequestException("the passwords has not been coincided!");
    }

    const user = await this.prisma.user.create({
      data: {
        name: userData.name,
        email: userData.email,
        birth: userData.birth,
        phone: userData.phone,
        password: userData.password,
        barbershopId: userData.barbershopId,
        role: userData.role,
      },
    });

    return new UserResponseDto(user);
  }

  async getbyId(userId: string): Promise<UserResponseDto | null> {
    const user: User | null = await this.prisma.user.findUnique({ where: { id: userId } });
    if (user) {
      return new UserResponseDto(user);
    } else {
      throw new BadRequestException("User not found!");
    }
  }

  async getAllbyName(name: string): Promise<UserResponseDto[] | null> {
    console.log(name);
    const users: User[] | null = await this.prisma.user.findMany({ where: { name: { contains: name, mode: 'insensitive'} } });
    if (users) {
      return users.map((user) => new UserResponseDto(user));
    } else {
      throw new BadRequestException("User not found!");
    }
  }

  async updateById(userId: string, userData: UserUpdateDto): Promise<UserResponseDto | null> {
    const user: User | null = await this.prisma.user.findUnique({ where: { id: userId } });
    if (user) {
      if (userData.password !== userData.confirmPassword) {
        throw new BadRequestException("the passwords has not been coincided!");
      }
      const passwordHashed: string = await bcrypt.hash(userData.password, 10);
      await this.prisma.user.update(
        {
          where: { id: userId },
          data: {
            name: userData.name,
            birth: new Date(userData.birth),
            phone: userData.phone,
            email: userData.email,
            role: userData.role,
            password: passwordHashed
          }
        });
      return await this.getbyId(userId);
    } else {
      throw new BadRequestException("User not found!");
    }
  }

  async deleteById(userId: string): Promise<any | null> {
    const user: User | null = await this.prisma.user.findUnique({ where: { id: userId } });
    if (user) {
      await this.prisma.user.delete({ where: { id: userId } });
      return {
        success: true,
        message: "User has been deleted with success!"
      }
    } else {
      throw new BadRequestException("User not found!");
    }
  }
}
