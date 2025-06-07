import { Module } from '@nestjs/common';
import { RolesGuard } from './guards/roles.guard';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports:[JwtModule, ConfigModule],
  providers: [RolesGuard],
  exports: [RolesGuard],
})
export class CommonModule {}
