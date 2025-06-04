import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { BarbershopController } from './barbershop.controller';
import { BarbershopService } from './barbershop.service';
import { EmailValidator } from './validators/email.validator';
import { JwtModule } from '@nestjs/jwt';
import { AuthGuard } from './barbershop.guard';

@Module({
  imports: [PrismaModule, JwtModule],
  controllers: [BarbershopController],
  providers: [BarbershopService, EmailValidator, AuthGuard],
})
export class BarbershopModule {}
