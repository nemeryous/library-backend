import {
  Body,
  Controller,
  Get,
  Post,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserEntity } from '../user/entity/user.entity';
import { RegisterFormDto } from './dto/register-form.dto';
import { RequireLoggedIn } from '../../guards/role-container';
import { CurrentUserDto } from './dto/current-user.dto';
import { RefreshTokenFormDto } from './dto/refresh-token-form.dto';
import { LoginFormDto } from './dto/login-form.dto';
import { AuthUser } from 'src/decorator/auth-user.decorator';
import { AuthResultDto } from './dto/auth-result.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auths')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterFormDto): Promise<AuthResultDto> {
    return AuthResultDto.fromAuthResult(
      await this.authService.register(
        RegisterFormDto.toRegisterForm(registerDto),
      ),
    );
  }

  @Post('login')
  async login(@Body() loginDto: LoginFormDto): Promise<AuthResultDto> {
    return AuthResultDto.fromAuthResult(
      await this.authService.login(LoginFormDto.toLoginForm(loginDto)),
    );
  }

  @Post('refresh-token')
  async refreshToken(
    @Body() refreshTokenFormDto: RefreshTokenFormDto,
  ): Promise<AuthResultDto> {
    return AuthResultDto.fromAuthResult(
      await this.authService.refreshToken(
        RefreshTokenFormDto.toRefreshTokenForm(refreshTokenFormDto),
      ),
    );
  }

  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  @RequireLoggedIn()
  getMe(@AuthUser() user: UserEntity): CurrentUserDto {
    return CurrentUserDto.fromUser(user);
  }
}
