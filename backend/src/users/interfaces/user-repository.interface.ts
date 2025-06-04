import { User } from '@prisma/client';
import { UserUpdateDTO } from '../dtos/user-update.dto';
import { UserResponseDto } from '../dtos/user.request.dto';

export interface IUserRepositoryInterface {
  create(data: UserUpdateDTO, hashedPassword: string): Promise<User>;
  remove(id: string): Promise<User>;
  update(id: string, userData: UserUpdateDTO): Promise<User | null>;
  findAllByName(name: string): Promise<UserResponseDto[]>;
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findByPhone(phone: string): Promise<User | null>;
}
