import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { JwtRefreshGuard } from './guard/JwtRefreshGuard';
import { RegisterDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto): Promise<AuthResponseDto> {
    return AuthResponseDto.fromAuth(
      await this.authService.login(LoginDto.toLogin(loginDto)),
    );
  }

  @Post('refresh')
  async refresh(
    @Body() refreshTokenDto: RefreshTokenDto,
  ): Promise<{ accessToken: string }> {
    return this.authService.refresh(refreshTokenDto.refreshToken);
  }

  @UseGuards(JwtRefreshGuard)
  @Post('logout')
  async logout(@Request() req): Promise<{ message: string }> {
    const refreshToken = req.get('Authorization').replace('Bearer', '').trim();
    await this.authService.logout(refreshToken);
    return { message: 'Logged out successfully' };
  }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() registerDto: RegisterDto): Promise<AuthResponseDto> {
    return this.authService.register(RegisterDto.toRegister(registerDto));
  }
}
