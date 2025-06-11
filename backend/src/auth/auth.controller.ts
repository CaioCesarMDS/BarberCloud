import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { User } from './decorators/auth.decorator';
import { SignInDTO } from './dtos/sign-in.dto';
import { ClientSignUpDTO, EmployeeSignUpDTO } from './dtos/sign-up.dto';
import { JwtPayload } from './interfaces/jwt.payload';
import { ForgotPasswordResponseDTO } from './dtos/forgot-password.response.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('client/signup')
  async clientSignUp(@Body() body: ClientSignUpDTO) {
    return await this.authService.clientSignUp(body);
  }

  @Post('employee/signup')
  async EmployeeSignUp(@Body() body: EmployeeSignUpDTO) {
    return await this.authService.employeeSignUp(body);
  }

  @Post('client/signin')
  async clientSignIn(@Body() body: SignInDTO) {
    return await this.authService.clientSignIn(body);
  }

  @Post('employee/signin')
  async employeeSignIn(@Body() body: SignInDTO) {
    return await this.authService.employeeSignIn(body);
  }

  @UseGuards(AuthGuard)
  @Get('/me')
  getProfile(@User() user: JwtPayload) {
    return user;
  }

  @Get('forgot-password/')
  async sendTokenToChangePassword(@Query('email') email: string): Promise<any> {
    await this.authService.sendResetPasswordCode(email);
    return {
      IsSent:  'email was sent successfully'
    };
  }

  @Get('forgot-password/reset')
  async verifyTokenToChangePassword(@Query('email') email: string, @Query('code') code: string, ): Promise<ForgotPasswordResponseDTO> {
    console.log(code)
    return await this.authService.verifyCode(email, code);
  }
}
