import { Role } from "@prisma/client"
import { IsEmail, IsEnum, IsJWT, IsString, IsUUID } from "class-validator"

export class AuthResponseDto {
    @IsUUID()
    readonly id: string
    @IsString()
    readonly name: string
    @IsEmail()
    readonly email: string
    @IsEnum(Role)
    readonly role: Role
    @IsJWT()
    readonly token: string
}