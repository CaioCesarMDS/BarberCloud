import {
  BadRequestException,
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
import { AuthGuard } from 'src/auth/auth.guard';
import { ClientService } from './client.service';
import { ClientDetailsDto } from './dtos/client-details.dto';
import { ClientUpdateDTO } from './dtos/client-update.dto';
import { ClientResponseDto } from './dtos/client.response.dto';
import { Client } from '@prisma/client';

@Controller('/client')
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @Get(':id')
  findOne(@Param('id') id: string): Promise<ClientResponseDto | null> {
    return this.clientService.findById(id);
  }

  @Get('')
  async findOneByEmail(
    @Query('email') email: string,
  ): Promise<ClientResponseDto | null> {
    const client: Client = await this.clientService.findByEmail(email);
    return {
      id: client.id,
      name: client.name,
      phone: client.phone,
      email: client.email,
    };
  }

  @UseGuards(AuthGuard)
  @Get('details/:id')
  getClientDetails(@Param('id') id: string): Promise<ClientDetailsDto | null> {
    return this.clientService.findDetailsById(id);
  }

  @Get('search/all')
  async getAllClientsByName(@Query('name') name: string) {
    if (!name?.trim()) {
      return new BadRequestException('Name query parameter is required');
    }
    console.log('chamouaqui');
    return await this.clientService.findAllByName(name);
  }

  @UseGuards(AuthGuard)
  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() data: ClientUpdateDTO,
  ): Promise<ClientResponseDto | null> {
    return this.clientService.update(id, data);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<any> {
    return {
      sucess: true,
      userDeleted: await this.clientService.remove(id),
    };
  }

  @UseGuards(AuthGuard)
  @Post('/subscribe/:clientId/on/:barbershopId')
  async subscribe(
    @Param('clientId') clientId: string,
    @Param('barbershopId') barbershopId: string,
  ): Promise<ClientDetailsDto> {
    return await this.clientService.subscribeInBarbershop(
      clientId,
      barbershopId,
    );
  }

  @UseGuards(AuthGuard)
  @Delete('/unsubscribe/:clientId/on/:barbershopId')
  async unsubscribe(
    @Param('clientId') clientId: string,
    @Param('barbershopId') barbershopId: string,
  ): Promise<any> {
    return {
      sucess: true,
      unSubscribeOf: barbershopId,
      clientDetails: await this.clientService.unSubscribeInBarbershop(
        clientId,
        barbershopId,
      ),
    };
  }
}
