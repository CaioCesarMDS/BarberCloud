import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserModule } from 'src/users/user.module';
// import { EmailValidator } from '../users/validators/email.validator';
// import { PhoneValidator } from '../users/validators/phone.validator';
import { AuthController } from './auth.controller';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';

@Module({
  imports: [UserModule],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtService,
    AuthGuard,
    // EmailValidator,
    // PhoneValidator,
  ],
})
export class AuthModule {}
