import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { SchedulingRequestDto } from './dtos/scheduling-request.dto';
import { SchedulingResponseDto } from './dtos/scheduling-response.dto';
import { SchedulingService } from './scheduling.service';
import { SchedulingUpdateDto } from './dtos/scheduling-update.dto';

@Controller('/scheduling')
export class SchedulingController {
  constructor(private readonly schedulingService: SchedulingService) {}

  @Post('create')
  create(@Body() body: SchedulingRequestDto): Promise<SchedulingResponseDto> {
    return this.schedulingService.create(body);
  }

  @Get('client/:clientId')
  async getByClientId(@Param('clientId') clientId: string) {
    return this.schedulingService.findByClientId(clientId);
  }
  
  @Put('/update/:id')
    async updateScheduling(@Param('id') id: string, @Body() data: SchedulingUpdateDto): Promise<SchedulingResponseDto> {
        return await this.schedulingService.update(id, data);
    }
}
