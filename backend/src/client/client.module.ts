import { forwardRef, Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PrismaModule } from 'prisma/prisma.module';
import { AuthModule } from 'src/auth/auth.module';
import { CommonModule } from 'src/common/common.module';
import { EmailValidator } from '../auth/validators/email.validator';
import { PhoneValidator } from '../auth/validators/phone.validator';
import { ClientController } from './client.controller';
import { ClientRepository } from './client.repository';
import { ClientService } from './client.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'REDIS_CLIENT',
        transport: Transport.REDIS,
        options: {
          host: 'localhost',
          port: 6379,
        },
      },
    ]),
    PrismaModule,
    forwardRef(() => AuthModule),
    CommonModule,
  ],
  controllers: [ClientController],
  providers: [ClientService, ClientRepository, EmailValidator, PhoneValidator],
  exports: [ClientService],
})
export class ClientModule {}
