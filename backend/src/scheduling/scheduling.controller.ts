import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { SchedulingRequestDto } from './dtos/scheduling-request.dto';
import { SchedulingResponseDto } from './dtos/scheduling-response.dto';
import { SchedulingService } from './scheduling.service';

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
}
