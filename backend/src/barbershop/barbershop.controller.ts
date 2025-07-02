import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { BadRequestException } from '@nestjs/common/exceptions/bad-request.exception';
import { AuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { BarbershopService } from './barbershop.service';
import { BarbershopRequestDto } from './dtos/barbeshop.request.dto';

@UseGuards(RolesGuard)
@Controller('/barbershop')
export class BarbershopController {
  constructor(private BarbershopService: BarbershopService) {}

  @Post('/create')
  createbBarbershop(@Body() body: BarbershopRequestDto) {
    return this.BarbershopService.create(body);
  }

  @UseGuards(AuthGuard)
  @Get('search/all')
  getAllBarbershopsByName(@Query('name') name: string) {
    if (!name?.trim()) {
      return new BadRequestException('Name query parameter is required');
    }
    return this.BarbershopService.findAllByName(name);
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  getUserById(@Param('id') id: string) {
    return this.BarbershopService.getById(id);
  }

  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  @Put('update/:id')
  updateUserById(@Param('id') id: string, @Body() data: BarbershopRequestDto) {
    return this.BarbershopService.updateById(id, data);
  }

  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  @Delete(':id')
  deleteUserById(@Param('id') id: string) {
    return this.BarbershopService.deleteById(id);
  }
}
