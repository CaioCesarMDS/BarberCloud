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
import { AuthGuard } from 'src/auth/auth.guard';
import { ClientService } from './client.service';
import { ClientDetailsDto } from './dtos/client-details.dto';
import { ClientUpdateDTO } from './dtos/client-update.dto';
import { ClientResponseDto } from './dtos/client.response.dto';

@UseGuards(AuthGuard)
@Controller('/client')
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @Get(':id')
  findOne(@Param('id') id: string): Promise<ClientResponseDto | null> {
    return this.clientService.findById(id);
  }

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
