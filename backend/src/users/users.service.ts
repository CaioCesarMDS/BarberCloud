import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { SignUpDTO } from 'src/auth/dtos/auth.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prismaService: PrismaService) {}

  async findByEmail(email: string) {
    return this.prismaService.user.findUnique({ where: { email: email } });
  }

  async findByPhone(phone: string) {
    return this.prismaService.user.findUnique({ where: { phone: phone } });
  }

  async createUser(data: SignUpDTO, hashedPassword: string): Promise<User> {
    return this.prismaService.user.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        password: hashedPassword,
      },
    });
  }
}
