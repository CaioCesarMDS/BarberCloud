import {
  Body,
  Controller,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { Address } from '@prisma/client';
import { AuthGuard } from 'src/auth/auth.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { AddressService } from './address.service';
import { CreateAddressDto } from './dtos/create-address.dto';
import { UpdateAddressDto } from './dtos/update-address.dto';

@UseGuards(AuthGuard, RolesGuard)
@Roles('ADMIN')
@Controller('/address')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @Post('create')
  create(@Body() body: CreateAddressDto): Promise<Address> {
    return this.addressService.create(body);
  }

  @Put('update/:id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: UpdateAddressDto,
  ): Promise<Address | null> {
    return this.addressService.update(id, body);
  }
}
