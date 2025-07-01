import {
  IsDate,
  IsEmail,
  IsOptional,
  IsString,
  IsStrongPassword,
  MaxLength,
  MinLength,
} from 'class-validator';

import { EmailIsUnique } from '../../auth/validators/email.validator';
import { PhoneIsUnique } from '../../auth/validators/phone.validator';
import { Type } from 'class-transformer';

export class ClientUpdateDTO {
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
  @Type(() => Date)
  birth?: Date;

  @IsOptional()
  @IsString()
  @IsEmail()
  @EmailIsUnique({ message: 'Email must be unique' })
  email?: string;

  @IsOptional()
  @IsString()
  @MinLength(8)
  @IsStrongPassword()
  password?: string;
}
