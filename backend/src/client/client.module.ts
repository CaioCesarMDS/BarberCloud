import { forwardRef, Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { AuthModule } from 'src/auth/auth.module';
import { CommonModule } from 'src/common/common.module';
import { RedisModule } from 'src/redis/redis.module';
import { EmailValidator } from '../auth/validators/email.validator';
import { PhoneValidator } from '../auth/validators/phone.validator';
import { ClientController } from './client.controller';
import { ClientRepository } from './client.repository';
import { ClientService } from './client.service';
import { BarbershopModule } from 'src/barbershop/barbershop.module';

@Module({
  imports: [
    RedisModule,
    PrismaModule,
    BarbershopModule,
    forwardRef(() => AuthModule),
    CommonModule,
  ],
  controllers: [ClientController],
  providers: [ClientService, ClientRepository, EmailValidator, PhoneValidator],
  exports: [ClientService],
})
export class ClientModule {}
