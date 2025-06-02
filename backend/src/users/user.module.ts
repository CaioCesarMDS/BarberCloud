import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { EmailValidator } from './validators/email.validator';
import { PhoneValidator } from './validators/phone.validator';
import { JwtModule } from '@nestjs/jwt';
import { AuthGuard } from './auth.guard';

@Module({
  imports: [PrismaModule, JwtModule],
  controllers: [UserController],
  providers: [UserService, EmailValidator, PhoneValidator, AuthGuard],
})
export class UserModule {}
