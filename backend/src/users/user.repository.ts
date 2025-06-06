import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { UserCreateDto } from './dtos/user-create.dto';
import { UserUpdateDto } from './dtos/user-update.dto';
import { IUserRepositoryInterface } from './interfaces/user-repository.interface';

@Injectable()
export class UserRepository implements IUserRepositoryInterface {
  constructor(private readonly prismaService: PrismaService) {}

  create(data: UserCreateDto, password: string): Promise<User> {
    return this.prismaService.user.create({
      data: {
        name: data.name,
        birthDate: data.birthDate,
        phone: data.phone,
        email: data.email,
        password: password,
        role: data.role,
      },
    });
  }

  update(id: string, data: UserUpdateDto): Promise<User> {
    return this.prismaService.user.update({
      where: { id: id },
      data: {
        name: data.name,
        birthDate: data.birthDate,
        phone: data.phone,
        email: data.email,
        role: data.role,
      },
    });
  }

  softDelete(id: string): Promise<User> {
    return this.prismaService.user.update({
      where: { id: id },
      data: { isActive: false },
    });
  }

  findById(id: string): Promise<User | null> {
    return this.prismaService.user.findUnique({ where: { id: id } });
  }

  findByPhone(phone: string): Promise<User | null> {
    return this.prismaService.user.findUnique({
      where: { phone: phone },
    });
  }

  findByEmail(email: string): Promise<User | null> {
    return this.prismaService.user.findUnique({
      where: { email: email },
    });
  }
}
