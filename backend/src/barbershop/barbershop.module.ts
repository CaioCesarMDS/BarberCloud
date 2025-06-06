import { forwardRef, Module } from '@nestjs/common';
import { CommonModule } from 'src/common/common.module';
import { PrismaModule } from '../../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { BarbershopController } from './barbershop.controller';
import { BarbershopRepository } from './barbershop.repository';
import { BarbershopService } from './barbershop.service';

@Module({
  imports: [PrismaModule, forwardRef(() => AuthModule), CommonModule],
  controllers: [BarbershopController],
  providers: [BarbershopService, BarbershopRepository],
})
export class BarbershopModule {}
