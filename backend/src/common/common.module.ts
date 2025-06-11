import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { RolesGuard } from './guards/roles.guard';

@Module({
  imports: [JwtModule, ConfigModule],
  providers: [RolesGuard],
  exports: [RolesGuard],
})
export class CommonModule {}
