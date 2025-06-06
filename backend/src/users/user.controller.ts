import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { AuthGuard } from 'src/auth/auth.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { UserUpdateDto } from './dtos/user-update.dto';
import { UserService } from './user.service';

@UseGuards(AuthGuard, RolesGuard)
@Controller('/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':id')
  find(@Param('id', ParseUUIDPipe) id: string): Promise<User | null> {
    return this.userService.findById(id);
  }

  @Patch(':id')
  @Roles('ADMIN')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() data: UserUpdateDto,
  ): Promise<User | null> {
    return this.userService.update(id, data);
  }

  @Delete(':id')
  @Roles('ADMIN')
  delete(@Param('id', ParseUUIDPipe) id: string): Promise<User> {
    return this.userService.delete(id);
  }
}
