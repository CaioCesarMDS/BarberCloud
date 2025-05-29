import { Role } from '@prisma/client';
import {
  IsDateString,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  IsUUID,
  MinLength,
} from 'class-validator';
import { EmailIsUnique } from '../validators/email.validator';
 import { PhoneIsUnique } from '../validators/phone.validator';

export class SignUpDTO {
  @IsNotEmpty()
  @IsString()
  name!: string;

  @IsNotEmpty()
  @MinLength(9)
  @PhoneIsUnique({ message: 'phone provided has already been registered' })
  phone!: string;

  @IsDateString()
  birth!: string;

  @IsNotEmpty()
  @IsUUID()
  barbershopId!: string;

  @IsEmail()
  @EmailIsUnique({ message: 'email provided has already been registered!' })
  email!: string;

  @IsNotEmpty()
  @IsStrongPassword()
  password!: string;

  @IsEnum(Role)
  role!: Role;
}
