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
import { Employee } from '@prisma/client';
import { AuthGuard } from 'src/auth/auth.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { CreateEmployeeDTO } from './dtos/create-employee.dto';
import { EmployeeUpdateDTO } from './dtos/employee-update.dto';
import { EmployeeResponseDto } from './dtos/employee.request.dto';
import { EmployeeService } from './employee.service';

@Controller('/employee')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Post('create')
  async createEmployee(
    @Body() data: CreateEmployeeDTO,
  ): Promise<Employee | null> {
    return await this.employeeService.create(data);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Employee | null> {
    return this.employeeService.findById(id);
  }

  @Get('')
  async findOneByEmail(
    @Query('email') email: string,
  ): Promise<EmployeeResponseDto> {
    return new EmployeeResponseDto(
      await this.employeeService.findByEmail(email),
    );
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Get('search/name')
  @Roles('ADMIN')
  getAllEmployeesByName(@Query('name') name: string) {
    if (!name?.trim()) {
      return new BadRequestException('Name query parameter is required');
    }
    return this.employeeService.findAllByName(name);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Get('search/all/:barbershopId')
  getAllEmployeesByBarbershopId(
    @Param('barbershopId') barbershopId: string,
  ): Promise<EmployeeResponseDto[]> {
    return this.employeeService.findAllByBarbershopId(barbershopId);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Put(':id')
  @Roles('ADMIN')
  update(
    @Param('id') id: string,
    @Body() data: EmployeeUpdateDTO,
  ): Promise<EmployeeResponseDto | null> {
    return this.employeeService.update(id, data);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Delete(':id')
  @Roles('ADMIN')
  remove(@Param('id') id: string): Promise<Employee> {
    return this.employeeService.remove(id);
  }
}
