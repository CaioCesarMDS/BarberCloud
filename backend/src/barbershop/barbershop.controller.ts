import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { BarbershopService } from './barbershop.service';
import { BarbershopRequestDto } from './dtos/barbershop.request.dto';

@UseGuards(RolesGuard)
@Controller('/barbershop')
export class BarbershopController {
  constructor(private BarbershopService: BarbershopService) {}

  @Roles('ADMIN')
  @Post('/create')
  createbBarbershop(@Body() body: BarbershopRequestDto) {
    return this.BarbershopService.create(body);
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  getUserById(@Param('id') id: string) {
    return this.BarbershopService.getById(id);
  }

  @Roles('ADMIN')
  @UseGuards(AuthGuard)
  @Put('update/:id')
  updateUserById(@Param('id') id: string, @Body() data: BarbershopRequestDto) {
    return this.BarbershopService.updateById(id, data);
  }

  @Roles('ADMIN')
  @UseGuards(AuthGuard)
  @Delete(':id')
  deleteUserById(@Param('id') id: string) {
    return this.BarbershopService.deleteById(id);
  }
}
