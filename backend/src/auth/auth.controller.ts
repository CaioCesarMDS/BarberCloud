import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { User } from './decorators/auth.decorator';
import { AuthLoginDto } from './dtos/authLogin.dto';
import { JwtPayload } from './interfaces/jwt.payload';
import { AuthRegisterDto } from './dtos/authRegister.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  signup(@Body() body: AuthRegisterDto) {
    return this.authService.signup(body);
  }

  @Post('signin')
  signin(@Body() body: AuthLoginDto) {
    return this.authService.signin(body);
  }

  @UseGuards(AuthGuard)
  @Get('me')
  getProfile(@User() user: JwtPayload) {
    return user;
  }
}