import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { EmailValidator } from './validators/email.validator';

@Module({
  imports: [PrismaModule],
  controllers: [UserController],
  providers: [UserService, EmailValidator],
})
export class UserModule {}
