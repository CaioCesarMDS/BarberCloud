import { forwardRef, Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { AuthModule } from 'src/auth/auth.module';
import { CommonModule } from 'src/common/common.module';
import { ClientController } from './client.controller';
import { ClientRepository } from './client.repository';
import { ClientService } from './client.service';
import { EmailValidator } from './validators/email.validator';
import { PhoneValidator } from './validators/phone.validator';

@Module({
  imports: [PrismaModule, forwardRef(() => AuthModule), CommonModule],
  controllers: [ClientController],
  providers: [ClientService, ClientRepository, EmailValidator, PhoneValidator],
  exports: [ClientService],
})
export class ClientModule {}
