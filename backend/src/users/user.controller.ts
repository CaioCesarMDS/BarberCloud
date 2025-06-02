import { BadRequestException, Body, Controller, Get, Headers, Param, Post, Put, UseGuards } from '@nestjs/common';
import { UserRequestDto } from './dtos/user.request.dto';
import { UserService } from './user.service';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from './auth.guard';
import { UserUpdateDto } from './dtos/user.update.dto';

@Controller('/user')
export class UserController {

  constructor(private userService: UserService, private jwtService: JwtService) { }

  @UseGuards(AuthGuard)
  @Post('/create')
  createUser(@Body() body: UserRequestDto) {
    return this.userService.create(body);
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  getUserById(@Param('id') id: string) {
    return this.userService.getbyId(id);
  }

  @UseGuards(AuthGuard)
  @Get('search/:name')
  getAllUserByName(@Param('name') name: string) {
    return this.userService.getAllbyName(name);
  }

  @UseGuards(AuthGuard)
  @Put('update/:id')
  updateUserById(@Param('id') id: string, @Body() userData: UserUpdateDto) {
    return this.userService.updateById(id, userData);
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  deleteUserById(@Param('id') id: string) {
    return this.userService.deleteById(id);
  }
}
