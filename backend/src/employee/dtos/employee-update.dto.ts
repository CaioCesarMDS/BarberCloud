import { Role } from '@prisma/client';
import {
  IsDate,
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  IsStrongPassword,
  MaxLength,
  MinLength,
} from 'class-validator';

import { EmailIsUnique } from '../../auth/validators/email.validator';
import { PhoneIsUnique } from '../../auth/validators/phone.validator';

export class EmployeeUpdateDTO {
  @IsOptional()
  @IsString()
  @MinLength(4)
  name?: string;

  @IsOptional()
  @IsString()
  @MinLength(9)
  @MaxLength(15)
  @PhoneIsUnique()
  phone?: string;

  @IsOptional()
  @IsDate()
  birth?: Date;

  @IsOptional()
  @IsEnum(Role)
  role?: Role;

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
