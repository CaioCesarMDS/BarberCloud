import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { UserCreateDto } from './dtos/user-create.dto';
import { UserUpdateDto } from './dtos/user-update.dto';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async create(data: UserCreateDto): Promise<User> {
    const hashedPassword = await this.hashPassword(data.password);
    return this.userRepository.create(data, hashedPassword);
  }

  async update(id: string, data: UserUpdateDto): Promise<User> {
    const user = await this.userRepository.update(id, data);
    return this.ensureUserExists(user);
  }

  async delete(id: string): Promise<User> {
    const user = await this.userRepository.softDelete(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async findById(id: string): Promise<User> {
    const user = await this.userRepository.findById(id);
    return this.ensureUserExists(user);
  }

  async findByPhone(phone: string): Promise<User> {
    const user = await this.userRepository.findByPhone(phone);
    return this.ensureUserExists(user);
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findByEmail(email);
    return this.ensureUserExists(user);
  }

  private ensureUserExists(user: User | null): User {
    if (!user || !user.isActive) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  private hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  isPasswordValid(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}
