import { Module } from '@nestjs/common';
import { ServicesController } from './services.controller';
import { ServicesService } from './services.service';
import { ServicesRequestDto } from './dtos/services-request.dto';
import { BarbershopModule } from 'src/barbershop/barbershop.module';
import { ServicesRepository } from './services.repository';
import { PrismaModule } from 'prisma/prisma.module';
import { CommonModule } from 'src/common/common.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [BarbershopModule, PrismaModule, CommonModule, AuthModule],
  controllers: [ServicesController],
  providers: [ServicesService, ServicesRequestDto, ServicesRepository],
  exports: [],
})
export class ServicesModule {}
