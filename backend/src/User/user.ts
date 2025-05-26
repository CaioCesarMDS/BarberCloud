import { IsDate, IsEmail, IsEnum, IsJWT, IsNotEmpty, IsPhoneNumber, IsString, IsStrongPassword, IsUUID } from "class-validator";
import { EmailIsUnique } from "./user.validator";
import { Role } from "@prisma/client";

export class UserRequestDto {
    @IsString()
    readonly name: string;
    @IsEmail()
    @IsNotEmpty()
    @EmailIsUnique({ message: "O email informado já existe!" })
    readonly email: string;
    @IsPhoneNumber("BR")
    readonly phone: string;
    @IsDate()
    readonly birth: Date;
    @IsStrongPassword()
    readonly password: string;
    @IsStrongPassword()
    readonly confirmPassword: string;
    @IsEnum(Role)
    readonly role: Role;
}

export class UserResponseDto {
    @IsUUID()
    readonly id: string;
    @IsString()
    readonly name: string;
    @IsEmail()
    readonly email: string;
    @IsEnum(Role)
    readonly role: Role;
}

export class UserLoginDto {
    @IsEmail()
    readonly email: string;
    @IsStrongPassword()
    readonly password: string;
    @IsJWT()
    readonly token: string;
}