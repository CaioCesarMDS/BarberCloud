import { forwardRef, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { BarbershopModule } from 'src/barbershop/barbershop.module';
import { ClientModule } from 'src/client/client.module';
import { EmployeeModule } from 'src/employee/employee.module';
import { AuthController } from './auth.controller';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';

@Module({
  imports: [
    forwardRef(() => EmployeeModule),
    forwardRef(() => BarbershopModule),
    forwardRef(() => ClientModule),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: configService.get<string>('JWT_EXPIRATION') },
      }),
    }),
    EmployeeModule,
    ClientModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthGuard],
  exports: [JwtModule, AuthGuard],
})
export class AuthModule {}
