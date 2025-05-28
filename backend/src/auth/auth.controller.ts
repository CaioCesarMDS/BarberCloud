import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { User } from './decorators/auth.decorator';
import { SignInDTO } from './dtos/sign-in.dto';
import { SignUpDTO } from './dtos/sign-up.dto';
import { JwtPayload } from './interfaces/jwt.payload';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  signup(@Body() body: SignUpDTO) {
    return this.authService.signUp(body);
  }

  @Post('signin')
  signin(@Body() body: SignInDTO) {
    return this.authService.signIn(body);
  }

  @UseGuards(AuthGuard)
  @Get('me')
  getProfile(@User() user: JwtPayload) {
    return user;
  }
}
