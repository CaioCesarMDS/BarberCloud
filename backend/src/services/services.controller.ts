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
import { Services } from '@prisma/client';
import { AuthGuard } from 'src/auth/auth.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { ServicesRequestDto } from './dtos/services-request.dto';
import { ServicesResponseDto } from './dtos/services-response.dto';
import { ServicesUpdateDto } from './dtos/services-update.dto';
import { ServicesService } from './services.service';

@UseGuards(AuthGuard, RolesGuard)
@Controller('/services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Roles('ADMIN')
  @Post('create')
  async createServiceInBarbershop(
    @Body() data: ServicesRequestDto,
  ): Promise<ServicesResponseDto> {
    return await this.servicesService.createService(data);
  }

  @Get('/:id')
  async getServiceById(@Param('id') id: number): Promise<ServicesResponseDto> {
    return await this.servicesService.getServiceById(id);
  }

  @Get('all/:barbershopId')
  async getAllServicesByBarbershopId(
    @Param('barbershopId') barbershopId: string,
  ): Promise<ServicesResponseDto[]> {
    return await this.servicesService.getAllByBarbershopId(barbershopId);
  }

  @Get('search/:barbershopId/:name')
  async getServiceFromBarbershopByName(
    @Param('barbershopId') barbershopId: string,
    @Param('name') name: string,
  ): Promise<ServicesResponseDto[]> {
    return await this.servicesService.findAllFromBarbershopByName(
      barbershopId,
      name,
    );
  }

  @Roles('ADMIN')
  @Put('/:id')
  async updateServiceById(
    @Param('id') id: number,
    @Body() data: ServicesUpdateDto,
  ): Promise<ServicesResponseDto> {
    return await this.servicesService.updateService(id, data);
  }

  @Roles('ADMIN')
  @Delete('/:id')
  async deleteServiceById(@Param('id') id: number): Promise<Services> {
    return await this.servicesService.removeService(id);
  }
}
