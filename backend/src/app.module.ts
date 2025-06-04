import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaService } from './prisma/prisma.service';
import { UserModule } from './users/user.module';

@Module({
  imports: [AuthModule, UserModule],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
