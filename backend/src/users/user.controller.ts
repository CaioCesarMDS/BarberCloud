import { Controller, Get, Post } from '@nestjs/common';

@Controller('/user')
export class UserController {
  @Post()
  createUser() {
    return 'sucess';
  }

  @Get()
  getUser() {
    return { status: 'sucess', message: 'ae   caraio part 2' };
  }
}
