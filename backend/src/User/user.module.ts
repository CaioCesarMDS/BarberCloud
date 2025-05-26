import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaModule } from '../../prisma/prisma.module';
import { EmailValidator } from './user.validator';

@Module({
  imports:[PrismaModule],
  controllers: [UserController],
  providers: [UserService, EmailValidator],
})
export class UserModule {}
