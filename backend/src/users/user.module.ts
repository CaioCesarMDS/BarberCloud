import { forwardRef, Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { AuthModule } from 'src/auth/auth.module';
import { UserController } from './user.controller';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';
import { EmailValidator } from './validators/email.validator';
import { PhoneValidator } from './validators/phone.validator';

@Module({
  imports: [PrismaModule, forwardRef(() => AuthModule)],
  controllers: [UserController],
  providers: [UserService, UserRepository, EmailValidator, PhoneValidator],
  exports: [UserService],
})
export class UserModule {}
