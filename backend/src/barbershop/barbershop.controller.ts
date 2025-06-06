import {
  Body,
  Controller,
  Delete,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { BarbershopService } from './barbershop.service';
import { BarbershopCreateDto } from './dtos/barbershop-create.dto';
import { BarbershopUpdateDto } from './dtos/barbershop-update.dto';

@UseGuards(AuthGuard, RolesGuard)
@Roles('ADMIN')
@Controller('/barbershop')
export class BarbershopController {
  constructor(private barbershopService: BarbershopService) {}

  @Post('create/:addressId')
  create(
    @Param('addressId', ParseUUIDPipe) AddressId: string,
    @Body() data: BarbershopCreateDto,
  ) {
    return this.barbershopService.create(AddressId, data);
  }

  @Put('update/:id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() data: BarbershopUpdateDto,
  ) {
    return this.barbershopService.update(id, data);
  }

  @Delete(':id')
  delete(@Param('id', ParseUUIDPipe) id: string) {
    return this.barbershopService.delete(id);
  }
}
