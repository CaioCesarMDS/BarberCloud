import {
    Body,
    Controller,
    Param,
    Post,
    Put,
} from '@nestjs/common';
import { SchedulingService } from './scheduling.service';
import { SchedulingRequestDto } from './dtos/scheduling-request.dto';
import { SchedulingResponseDto } from './dtos/scheduling-response.dto';
import { SchedulingUpdateDto } from './dtos/scheduling-update.dto';

@Controller('/scheduling')
export class SchedulingController {
    constructor(private readonly schedulingService: SchedulingService) { }

    @Post('/create')
    async createScheduling(data: SchedulingRequestDto): Promise<SchedulingResponseDto> {
        return await this.schedulingService.create(data);
    }

    @Put('/update/:id')
    async updateScheduling(@Param('id') id: string, @Body() data: SchedulingUpdateDto): Promise<SchedulingResponseDto> {
        return await this.schedulingService.update(id, data);
    }
}
