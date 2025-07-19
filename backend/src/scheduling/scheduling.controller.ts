import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { SchedulingRequestDto } from './dtos/scheduling-request.dto';
import { SchedulingResponseDto } from './dtos/scheduling-response.dto';
import { SchedulingService } from './scheduling.service';
import { SchedulingUpdateDto } from './dtos/scheduling-update.dto';
import { Scheduling } from '@prisma/client';

@Controller('/scheduling')
export class SchedulingController {
  constructor(private readonly schedulingService: SchedulingService) { }

  @Post('create')
  create(@Body() body: SchedulingRequestDto): Promise<SchedulingResponseDto> {
    return this.schedulingService.create(body);
  }

  @Put('/update/:id')
  async updateScheduling(@Param('id') id: string, @Body() data: SchedulingUpdateDto): Promise<SchedulingResponseDto> {
    return await this.schedulingService.update(id, data);
  }

  @Delete('/:id')
  async deleteScheduling(@Param('id') id: string): Promise<Scheduling> {
    return await this.schedulingService.delete(id);
  }

  @Get('/:id')
  async getScheduling(@Param('id') id: string): Promise<SchedulingResponseDto> {
    return await this.schedulingService.findScheduleById(id);
  }

  @Get('all/client/')
  async getAllByClientId(@Query('clientId') clientId: string) {
    return this.schedulingService.findAllByClientId(clientId);
  }

  @Get('all/client')
  async getAllByClientName(@Query('clientName') clientName: string) {
    return this.schedulingService.findAllByClientName(clientName);
  }

  @Get('all/employee/')
  async getAllByEmployeeId(@Query('employeeId') employeeId: string) {
    return this.schedulingService.findAllByEmployeeId(employeeId);
  }

  @Get('all/employee/')
  async getAllByemployeeName(@Query('employeeName') employeeName: string) {
    return this.schedulingService.findAllByEmployeeName(employeeName);
  }

  @Get('all/barbershop/')
  async getAllByBarbershopId(@Query('barbershopId') barbershopId: string) {
    return this.schedulingService.findAllByBarbershopId(barbershopId);
  }

}
