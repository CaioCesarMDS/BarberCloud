import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserController } from './user.controller';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';
import { EmailValidator } from './validators/email.validator';
import { PhoneValidator } from './validators/phone.validator';

@Module({
  imports: [],
  controllers: [UserController],
  providers: [
    UserService,
    UserRepository,
    PrismaService,
    EmailValidator,
    PhoneValidator,
  ],
  exports: [UserService],
})
export class UserModule {}
