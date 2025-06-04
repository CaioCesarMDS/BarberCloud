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
    const hashedPassword = await bcrypt.hash(data.password, 10);
    return await this.userRepository.create(data, hashedPassword);
  }

  async remove(id: string): Promise<User> {
    return await this.userRepository.remove(id);
  }

  async update(id: string, userData: UserUpdateDTO): Promise<User | null> {
    return await this.userRepository.update(id, userData);
  }

  async findById(id: string): Promise<User | null> {
    return await this.userRepository.findById(id);
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findByEmail(email);
  }

  async getAllbyName(name: string): Promise<UserResponseDto[]> {
    return await this.userRepository.getAllbyName(name);
  }

  isPasswordValid(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}
