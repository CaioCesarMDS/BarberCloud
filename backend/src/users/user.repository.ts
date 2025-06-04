import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { UserRepositoryInterface } from './interfaces/user-repository.interface';

@Injectable()
export class UserRepository implements UserRepositoryInterface {
  constructor(private readonly prismaService: PrismaService) {}

  findByEmail(email: string): Promise<User | null> {
    return this.prismaService.user.findUnique({ where: { email: email } });
  }

  findByPhone(phone: string): Promise<User | null> {
    return this.prismaService.user.findUnique({ where: { phone: phone } });
  }

  create(data: CreateUserDto, hashedPassword: string): Promise<User> {
    return this.prismaService.user.create({
      data: {
        name: data.name,
        phone: data.phone,
        birth: data.birth,
        email: data.email,
        password: hashedPassword,
        role: data.role,
      },
    });
  }
}
