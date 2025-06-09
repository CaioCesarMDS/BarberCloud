import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { RoleJwtPayload } from '../common/interfaces/jwt.payload';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { User } from './decorators/auth.decorator';
import { SignInDTO } from './dtos/sign-in.dto';
import { ClientSignUpDTO, EmployeeSignUpDTO } from './dtos/sign-up.dto';
import { JwtPayload } from './interfaces/jwt.payload';

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
  employeeGetProfile(@User() user: JwtPayload) {
    return user;
  }
}
