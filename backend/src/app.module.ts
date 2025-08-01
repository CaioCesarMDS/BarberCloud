import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { EmailModule } from './email/email.module';
import { EmployeeModule } from './employee/employee.module';
import { SchedulingModule } from './scheduling/scheduling.module';
import { ServicesModule } from './services/services.module';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: '.env', isGlobal: true }),
    AuthModule,
    EmployeeModule,
    EmailModule,
    ServicesModule,
    SchedulingModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
