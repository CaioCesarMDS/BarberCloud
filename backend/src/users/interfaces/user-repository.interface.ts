import { User } from '@prisma/client';
import { UserCreateDto } from '../dtos/user-create.dto';
import { UserUpdateDto } from '../dtos/user-update.dto';

export interface IUserRepositoryInterface {
  create(data: UserCreateDto, password: string): Promise<User>;
  update(id: string, userData: UserUpdateDto): Promise<User>;
  softDelete(id: string): Promise<User>;
  findById(id: string): Promise<User | null>;
  findByPhone(phone: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
}
