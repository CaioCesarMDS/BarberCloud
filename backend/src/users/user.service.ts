import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { CreateUserDTO } from './dtos/create-user.dto';
import { UserUpdateDTO } from './dtos/user-update.dto';
import { UserResponseDto } from './dtos/user.request.dto';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async create(data: CreateUserDTO): Promise<User> {
    const hashedPassword = await this.hashPassword(data.password);
    return this.userRepository.create(data, hashedPassword);
  }

  remove(id: string): Promise<User> {
    return this.userRepository.remove(id);
  }

  update(id: string, userData: UserUpdateDTO): Promise<User | null> {
    return this.userRepository.update(id, userData);
  }

  findAllByName(name: string): Promise<UserResponseDto[]> {
    return this.userRepository.findAllByName(name);
  }

  findById(id: string): Promise<User | null> {
    return this.userRepository.findById(id);
  }

  findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findByEmail(email);
  }

  hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  isPasswordValid(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}
