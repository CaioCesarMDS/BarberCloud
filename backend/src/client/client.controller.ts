import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Client } from '@prisma/client';
import { AuthGuard } from 'src/auth/auth.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { ClientUpdateDTO } from './dtos/client-update.dto';
import { ClientService } from './client.service';
import { ClientDetailsDto } from './dtos/client-details.dto';
import { ClientResponseDto } from './dtos/client.response.dto';

@UseGuards(AuthGuard, RolesGuard)
@Controller('/Clients')
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Client | null> {
    return this.clientService.findById(id);
  }

  @Get('details/:id')
  getClientDetails(@Param('id') id: string): Promise<ClientDetailsDto | null> {
    return this.clientService.findDetailsById(id);
  }

  @Get('search')
  getAllClientsByName(@Query('name') name: string) {
    if (!name?.trim()) {
      return new BadRequestException('Name query parameter is required');
    }
    return this.clientService.findAllByName(name);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() data: ClientUpdateDTO,
  ): Promise<ClientResponseDto | null> {
    return this.clientService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<ClientResponseDto> {
    return this.clientService.remove(id);
  }
}
