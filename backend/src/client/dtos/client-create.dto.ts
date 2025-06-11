import { Type } from 'class-transformer';
import {
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  MaxLength,
  MinLength,
} from 'class-validator';
import { EmailIsUnique } from '../../auth/validators/email.validator';
import { PhoneIsUnique } from '../../auth/validators/phone.validator';

export class CreateClientDTO {
  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  name!: string;

  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  birth!: Date;

  @IsNotEmpty()
  @IsString()
  @MinLength(9)
  @MaxLength(15)
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
}
