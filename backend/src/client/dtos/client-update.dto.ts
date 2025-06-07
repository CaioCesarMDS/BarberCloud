import { Role } from '@prisma/client';
import {
  IsDate,
  IsEmail,
  IsEnum,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsStrongPassword,
  MinLength,
} from 'class-validator';

import { EmailIsUnique } from '../../auth/validators/email.validator';
import { PhoneIsUnique } from '../../auth/validators/phone.validator';

export class ClientUpdateDTO {
  @IsOptional()
  @IsString()
  @MinLength(4)
  name?: string;

  @IsOptional()
  @IsString()
  @MinLength(9)
  @IsPhoneNumber('BR')
  @PhoneIsUnique()
  phone?: string;

  @IsOptional()
  @IsDate()
  birth?: Date;

  @IsOptional()
  @IsString()
  @IsEmail()
  @EmailIsUnique()
  email?: string;

  @IsOptional()
  @IsString()
  @MinLength(8)
  @IsStrongPassword()
  password?: string;
}
