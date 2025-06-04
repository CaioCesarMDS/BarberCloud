import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { CommonModule } from 'src/common/common.module';
import { PrismaModule } from '../../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { BarbershopController } from './barbershop.controller';
import { BarbershopService } from './barbershop.service';

@Module({
  imports: [
    PrismaModule,
    JwtModule,
    forwardRef(() => AuthModule),
    CommonModule,
  ],
  controllers: [BarbershopController],
  providers: [BarbershopService],
})
export class BarbershopModule {}
