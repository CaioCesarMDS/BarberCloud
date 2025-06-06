import { forwardRef, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AddressModule } from 'src/address/address.module';
import { BarbershopModule } from 'src/barbershop/barbershop.module';
import { UserModule } from 'src/users/user.module';
import { AuthController } from './auth.controller';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';

@Module({
  imports: [
    forwardRef(() => UserModule),
    forwardRef(() => BarbershopModule),
    forwardRef(() => AddressModule),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: configService.get<string>('JWT_EXPIRATION') },
      }),
    }),
    UserModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthGuard],
  exports: [JwtModule, AuthGuard],
})
export class AuthModule {}
