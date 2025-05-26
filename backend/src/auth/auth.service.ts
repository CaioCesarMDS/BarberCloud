import { ConflictException, Injectable, UnauthorizedException } from "@nestjs/common";
import { PrismaService } from "prisma/prisma.service";
import { AuthLoginDto } from "./dtos/authLogin.dto";
import { PasswordService } from "./password.service";
import { User } from "@prisma/client";
import { randomUUID } from "crypto";
import { AuthGuard } from "./auth.guard";
import { AuthResponseDto } from "./dtos/authResponse.dto";
import { AuthRegisterDto } from "./dtos/authRegister.dto";

@Injectable()
export class AuthService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly passwordService: PasswordService,
        private readonly authGuard: AuthGuard
    ) { }

    async signup(data: AuthRegisterDto): Promise<AuthResponseDto> {
        const user = await this.createUser(data);
        if (!user) throw new ConflictException('User creation failed');

        return await this.authGuard.generateAccessToken(user);
    }

    async signin(data: AuthLoginDto): Promise<AuthResponseDto> {
        const user = await this.findByEmail(data.email);
        if (!user) throw new UnauthorizedException('Invalid credentials');

        await this.validatePassword(data.password, user.password);

        return await this.authGuard.generateAccessToken(user);
    }

    async findByEmail(email: string) {
        return this.prismaService.user.findUnique({ where: { email: email } });
    }

    async findByPhone(phone: string) {
        return this.prismaService.user.findUnique({ where: { phone: phone } });
    }

    private async createUser(data: AuthRegisterDto): Promise<User> {
        const hashedPassword = await this.passwordService.hash(data.password);
        return await this.prismaService.user.create({
            data: {
                id: randomUUID(),
                name: data.name,
                email: data.email,
                birth: new Date(data.birth),
                phone: data.phone,
                password: hashedPassword,
                role: data.role
            },
        });
    }

    private async validatePassword(password: string, hash: string): Promise<void> {
        const passwordMatch = await this.passwordService.compare(password, hash);

        if (!passwordMatch) {
            throw new UnauthorizedException('Invalid credentials');
        }
    }
}