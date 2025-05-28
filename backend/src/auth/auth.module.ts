import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaModule } from 'prisma/prisma.module';
import { AuthController } from './auth.controller';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { EmailValidator } from './validators/email.validator';
import { PhoneValidator } from './validators/phone.validator';

@Module({
  imports: [PrismaModule],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtService,
    AuthGuard,
    EmailValidator,
    PhoneValidator,
  ],
})
export class AuthModule {}
