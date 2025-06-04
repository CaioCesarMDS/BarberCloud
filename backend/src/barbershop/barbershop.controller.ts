import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { BarbershopRequestDto } from './dtos/barbershop.request.dto';
import { BarbershopService } from './barbershop.service';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from './barbershop.guard';

@Controller('/barbershop')
export class BarbershopController {

  constructor(private BarbershopService: BarbershopService, private jwtService: JwtService) { }

  @Post('/create')
  createbBarbershop(@Body() body: BarbershopRequestDto) {
    return this.BarbershopService.create(body);
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  getUserById(@Param('id') id: string) {
    return this.BarbershopService.getbyId(id);
  }


  @UseGuards(AuthGuard)
  @Put('update/:id')
  updateUserById(@Param('id') id: string, @Body() data: BarbershopRequestDto) {
    return this.BarbershopService.updateById(id, data);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  deleteUserById(@Param('id') id: string) {
    return this.BarbershopService.deleteById(id);
  }
}
