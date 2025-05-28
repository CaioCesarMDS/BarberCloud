import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { UserRequestDto, UserResponseDto } from './user';

@Injectable()
export class UserService {
  @Inject()
  private readonly prisma!: PrismaService;

  async create(
    userData: UserRequestDto,
    token: string,
  ): Promise<UserResponseDto | null> {
    const createToken: string = '';

    if (token === createToken) {
      // throw exception
    }

    if (userData.password !== userData.confirmPassword) {
      // throw exception
    }

    const userExists = await this.prisma.user.findUnique({
      where: { email: userData.email },
    });

    if (userExists) {
      // throw exception
    }

    const user = await this.prisma.user.create({
      data: {
        name: userData.name,
        email: userData.email,
        birth: userData.birth,
        phone: userData.phone,
        password: userData.password,
        role: userData.role,
      },
    });

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
  }
}
