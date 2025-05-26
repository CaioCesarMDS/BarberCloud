import { IsDateString, IsEmail, IsEnum, IsPhoneNumber, IsString, IsStrongPassword } from "class-validator";
import { EmailIsUnique, PhoneIsUnique } from "../auth.validator";
import { Role } from "@prisma/client";

export class AuthRegisterDto {
    @IsString()
    readonly name: string
    @IsEmail()
    @EmailIsUnique({ message: "email provided has already been registered!" })
    readonly email: string
    @IsPhoneNumber("BR")
    @PhoneIsUnique(({ message: "phone provided has already been registered" }))
    readonly phone: string;
    @IsDateString()
    readonly birth: string;
    @IsStrongPassword()
    readonly password: string
    @IsStrongPassword()
    readonly confirmPassword: string
    @IsEnum(Role)
    readonly role: Role
}