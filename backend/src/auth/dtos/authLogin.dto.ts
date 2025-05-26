import { IsEmail, IsStrongPassword } from "class-validator"

export class AuthLoginDto {
    @IsEmail()
    readonly email: string
    @IsStrongPassword()
    readonly password: string
}