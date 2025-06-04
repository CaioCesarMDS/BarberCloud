import { Role } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  IsStrongPassword,
  MinLength,
} from 'class-validator';
import { EmailIsUnique } from '../validators/email.validator';
import { PhoneIsUnique } from '../validators/phone.validator';

export class CreateUserDTO {
  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  name!: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(9)
  @IsPhoneNumber('BR')
  @PhoneIsUnique()
  phone!: string;

  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  birth!: Date;

  @IsNotEmpty()
  @IsEnum(Role)
  role!: Role;

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  @EmailIsUnique()
  email!: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @IsStrongPassword()
  password!: string;

  @IsNotEmpty()
  @IsString()
  barbershopId!: string;
}
