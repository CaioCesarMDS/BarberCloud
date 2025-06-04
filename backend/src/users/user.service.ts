import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dtos/create-user.dto';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async createUser(data: CreateUserDto): Promise<User> {
    try {
      await this.validateUser(data.email, data.phone);
      const hashedPassword = await bcrypt.hash(data.password, 10);
      return await this.userRepository.create(data, hashedPassword);
    } catch (error) {
      if (error instanceof Error) {
        throw new InternalServerErrorException(
          'Failed to create user error ' + error.message,
        );
      }

      throw new InternalServerErrorException(
        'An unexpected error occurred while creating user',
      );
    }
  }

  async findUser(email: string): Promise<User> {
    try {
      const user = await this.userRepository.findByEmail(email);
      if (!user) {
        throw new NotFoundException('User not found');
      }
      return user;
    } catch (error) {
      if (error instanceof Error) {
        throw new InternalServerErrorException(
          'Failed to find user error ' + error.message,
        );
      }

      throw new InternalServerErrorException(
        'An unexpected error occurred while finding user',
      );
    }
  }

  async isPasswordValid(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  private async validateUser(email: string, phone: string): Promise<void> {
    try {
      const emailInUse = await this.userRepository.findByEmail(email);
      if (emailInUse) {
        throw new ConflictException('Email already in use');
      }

      const phoneInUse = await this.userRepository.findByPhone(phone);
      if (phoneInUse) {
        throw new ConflictException('Phone number already in use');
      }
    } catch (error) {
      if (error instanceof ConflictException) throw error;

      if (error instanceof Error) {
        throw new InternalServerErrorException(
          'Failed to validate user ' + error.message,
        );
      }

      throw new InternalServerErrorException(
        'An unexpected error occurred while validating user',
      );
    }
  }
}
