import { IsEmail, IsNotEmpty } from 'class-validator';

export class SignInDTO {
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @IsNotEmpty()
  password!: string;
}
