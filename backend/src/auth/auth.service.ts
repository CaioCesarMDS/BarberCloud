import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { PasswordService } from 'src/password/password.service';
import { UsersService } from 'src/users/users.service';
import {
  AuthResponseDTO,
  AuthTokenDTO,
  SignInDTO,
  SignUpDTO,
} from './dtos/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
    private passwordService: PasswordService,
  ) {}

  async signup(data: SignUpDTO): Promise<AuthResponseDTO> {
    const userAlreadyExists = await this.findUserByEmail(data.email);
    if (userAlreadyExists) throw new ConflictException('User already exists');

    await this.validatePhoneNotInUse(data.phone);

    const user = await this.createUser(data);
    if (!user) throw new ConflictException('User creation failed');

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
    };
  }

  async signin(data: SignInDTO): Promise<AuthTokenDTO> {
    const user = await this.findUserByEmail(data.email);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    await this.validatePassword(data.password, user.password);

    return await this.generateAccessToken(user);
  }

  private async findUserByEmail(email: string): Promise<User | null> {
    return await this.userService.findByEmail(email);
  }

  private async validatePhoneNotInUse(phone: string): Promise<void> {
    const user = await this.userService.findByPhone(phone);

    if (user) throw new ConflictException('Phone number already in use');
  }

  private async createUser(data: SignUpDTO): Promise<User> {
    const hashedPassword = await this.passwordService.hash(data.password);
    return await this.userService.createUser(data, hashedPassword);
  }

  private async validatePassword(
    password: string,
    hash: string,
  ): Promise<void> {
    const passwordMatch = await this.passwordService.compare(password, hash);

    if (!passwordMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }
  }

  private async generateAccessToken(user: User): Promise<AuthTokenDTO> {
    const token = await this.jwtService.signAsync({
      id: user.id,
      name: user.name,
      email: user.email,
    });

    return { accessToken: token };
  }
}
