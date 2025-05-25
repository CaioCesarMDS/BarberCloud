import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class SignUpDTO {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @MinLength(9)
  phone: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(8)
  password: string;
}

export class SignInDTO {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;
}

export class AuthResponseDTO {
  id: string;
  name: string;
  email: string;
  phone: string;
}

export class AuthTokenDTO {
  accessToken: string;
}
