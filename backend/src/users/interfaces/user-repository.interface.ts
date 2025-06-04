import { User } from '@prisma/client';
import { CreateUserDto } from '../dtos/create-user.dto';

export interface UserRepositoryInterface {
  findByEmail(email: string): Promise<User | null>;
  findByPhone(phone: string): Promise<User | null>;
  create(data: CreateUserDto, hashedPassword: string): Promise<User>;
}
