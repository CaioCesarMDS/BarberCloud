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
import { Employee } from '@prisma/client';
import { AuthGuard } from 'src/auth/auth.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { EmployeeUpdateDTO } from './dtos/employee-update.dto';
import { EmployeeService } from './employee.service';

@UseGuards(AuthGuard, RolesGuard)
@Controller('/Employees')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Employee | null> {
    return this.employeeService.findById(id);
  }

  @Get('search')
  @Roles('ADMIN')
  getAllEmployeesByName(@Query('name') name: string) {
    if (!name?.trim()) {
      return new BadRequestException('Name query parameter is required');
    }
    return this.employeeService.findAllByName(name);
  }

  @Put(':id')
  @Roles('ADMIN')
  update(
    @Param('id') id: string,
    @Body() data: EmployeeUpdateDTO,
  ): Promise<Employee | null> {
    return this.employeeService.update(id, data);
  }

  @Delete(':id')
  @Roles('ADMIN')
  remove(@Param('id') id: string): Promise<Employee> {
    return this.employeeService.remove(id);
  }
}
