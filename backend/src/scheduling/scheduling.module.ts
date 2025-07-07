import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { SchedulingController } from './scheduling.controller';
import { SchedulingRepository } from './scheduling.repository';
import { SchedulingService } from './scheduling.service';

@Module({
  imports: [PrismaModule],
  controllers: [SchedulingController],
  providers: [SchedulingService, SchedulingRepository],
})
export class SchedulingModule {}
