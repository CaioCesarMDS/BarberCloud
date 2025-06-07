import { forwardRef, Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { AuthModule } from 'src/auth/auth.module';
import { CommonModule } from 'src/common/common.module';
import { EmployeeController } from './employee.controller';
import { EmployeeRepository } from './employee.repository';
import { EmployeeService } from './employee.service';
import { EmailValidator } from '../auth/validators/email.validator';
import { PhoneValidator } from '../auth/validators/phone.validator';

@Module({
  imports: [PrismaModule, forwardRef(() => AuthModule), CommonModule],
  controllers: [EmployeeController],
  providers: [
    EmployeeService,
    EmployeeRepository,
    EmailValidator,
    PhoneValidator,
  ],
  exports: [EmployeeService],
})
export class EmployeeModule {}
