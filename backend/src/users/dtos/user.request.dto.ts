import { IsDateString, IsEmail, IsEnum, IsNotEmpty, IsString, IsStrongPassword, IsUUID } from "class-validator";
import { EmailIsUnique } from "../validators/email.validator";
import { PhoneIsUnique } from "../validators/phone.validator";
import { Role } from "@prisma/client";

export class UserRequestDto {
    @IsString()
    readonly name!: string;
    @IsNotEmpty()
    @PhoneIsUnique()
    readonly phone!: string;
    @IsDateString()
    readonly birth!: Date;
    @IsEnum(Role)
    readonly role!: Role;
    @IsNotEmpty()
    @IsUUID()
    readonly barbershopId!: string
    @IsEmail()
    @IsNotEmpty()
    @EmailIsUnique()
    readonly email!: string;
    @IsStrongPassword()
    readonly password!: string;
    @IsStrongPassword()
    readonly confirmPassword!: string;
}