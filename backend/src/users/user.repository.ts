import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { CreateUserDTO } from './dtos/create-user.dto';
import { UserUpdateDTO } from './dtos/user-update.dto';
import { UserResponseDto } from './dtos/user.request.dto';
import { IUserRepositoryInterface } from './interfaces/user-repository.interface';

@Injectable()
export class UserRepository implements IUserRepositoryInterface {
  constructor(private readonly prismaService: PrismaService) {}

  create(data: CreateUserDTO, hashedPassword: string): Promise<User> {
    return this.prismaService.user.create({
      data: {
        name: data.name,
        phone: data.phone,
        birth: data.birth,
        email: data.email,
        password: hashedPassword,
        role: data.role,
        barbershopId: data.barbershopId,
      },
    });
  }

  remove(id: string): Promise<User> {
    return this.prismaService.user.delete({ where: { id: id } });
  }

  update(id: string, data: UserUpdateDTO): Promise<User | null> {
    return this.prismaService.user.update({
      where: { id: id },
      data: {
        name: data.name,
        phone: data.phone,
        birth: data.birth,
        email: data.email,
        role: data.role,
      },
    });
  }

  async findAllByName(name: string): Promise<UserResponseDto[]> {
    const users = await this.prismaService.user.findMany({
      where: { name: { contains: name, mode: 'insensitive' } },
    });

    return users.map((user) => new UserResponseDto(user));
  }

  findById(id: string): Promise<User | null> {
    return this.prismaService.user.findUnique({ where: { id: id } });
  }

  findByEmail(email: string): Promise<User | null> {
    return this.prismaService.user.findUnique({
      where: { email: email },
    });
  }

  findByPhone(phone: string): Promise<User | null> {
    return this.prismaService.user.findUnique({
      where: { phone: phone },
    });
  }
}
