import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { PasswordService } from "./password.service";
import { JwtService } from "@nestjs/jwt";
import { EmailValidator, PhoneValidator } from "./auth.validator";
import { PrismaModule } from "prisma/prisma.module";
import { AuthGuard } from "./auth.guard";

@Module({
    imports: [PrismaModule],
    controllers: [AuthController],
    providers: [
        AuthService,
        PasswordService,
        JwtService,
        AuthGuard,
        EmailValidator, 
        PhoneValidator
    ]
})
export class AuthModule { }