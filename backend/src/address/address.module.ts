import { forwardRef, Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { AuthModule } from 'src/auth/auth.module';
import { AddressController } from './address.controller';
import { AddressRepository } from './address.repository';
import { AddressService } from './address.service';

@Module({
  imports: [PrismaModule, forwardRef(() => AuthModule)],
  providers: [AddressService, AddressRepository],
  controllers: [AddressController],
})
export class AddressModule {}
