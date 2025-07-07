import { forwardRef, Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { AuthModule } from 'src/auth/auth.module';
import { CommonModule } from 'src/common/common.module';
import { SchedulingRepository } from './scheduling.repository';
import { SchedulingController } from './scheduling.controller';
import { SchedulingService } from './scheduling.service';


@Module({
  imports: [
    PrismaModule,
    forwardRef(() => AuthModule),
    CommonModule,
  ],
  controllers: [SchedulingController],
  providers: [
    SchedulingRepository,
    SchedulingService,
  ],
  exports: [],
})
export class SchedulingModule {}
