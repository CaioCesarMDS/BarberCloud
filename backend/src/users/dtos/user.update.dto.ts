import { Role } from "@prisma/client";
import { IsDateString, IsEmail, IsEnum, IsNotEmpty, IsString, IsStrongPassword, IsUUID } from "class-validator";

export class UserUpdateDto {
    @IsString()
    readonly name!: string;
    @IsNotEmpty()
    readonly phone!: string;
    @IsDateString()
    readonly birth!: Date;
    @IsEnum(Role)
    readonly role!: Role;
    @IsEmail()
    @IsNotEmpty()
    readonly email!: string;
    @IsStrongPassword()
    readonly password!: string;
    @IsStrongPassword()
    readonly confirmPassword!: string;
}