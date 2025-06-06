import { SystemRole } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  MinLength,
} from 'class-validator';
import { EmailIsUnique } from '../validators/email.validator';
import { PhoneIsUnique } from '../validators/phone.validator';

export class UserCreateDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  name!: string;

  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  birthDate!: Date;

  @IsNotEmpty()
  @IsString()
  @MinLength(9)
  @PhoneIsUnique()
  phone!: string;

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
  @IsEnum(SystemRole)
  role!: SystemRole;
}
