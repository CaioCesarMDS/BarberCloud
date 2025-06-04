import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { JwtPayload } from '../common/interfaces/jwt.payload';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { User } from './decorators/auth.decorator';
import { SignInDTO } from './dtos/sign-in.dto';
import { SignUpDTO } from './dtos/sign-up.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  async signUp(@Body() body: SignUpDTO) {
    return await this.authService.signUp(body);
  }

  @Post('signin')
  async signIn(@Body() body: SignInDTO) {
    return await this.authService.signIn(body);
  }

  @UseGuards(AuthGuard)
  @Get('me')
  getProfile(@User() user: JwtPayload) {
    return user;
  }
}
