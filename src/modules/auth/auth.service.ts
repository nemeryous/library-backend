// filepath: d:\Workspace\library-backend\src\modules\auth\auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { UserService } from '../user/user.service';
import { LoginDto } from './dto/login.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { RefreshTokenEntity } from './entity/refresh-token.entity';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    @InjectRepository(RefreshTokenEntity)
    private refreshTokenRepository: Repository<RefreshTokenEntity>,
  ) {}

  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    const user = await this.validateUser(loginDto.email, loginDto.password);
    const payload = { email: user.email, sub: user.id, role: user.role };

    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_ACCESS_SECRET || 'jwt-access-secret',
      expiresIn: '15m',
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET || 'jwt-refresh-secret',
      expiresIn: '7d',
    });

    await this.storeRefreshToken(refreshToken, user.id);

    return {
      accessToken,
      refreshToken,
      user,
    };
  }

  async refresh(refreshToken: string): Promise<{ accessToken: string }> {
    const decoded = this.jwtService.verify(refreshToken, {
      secret: process.env.JWT_REFRESH_SECRET || 'jwt-refresh-secret',
    });

    const isValid = await this.validateRefreshToken(refreshToken, decoded.sub);
    if (!isValid) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const user = await this.userService.findOne(decoded.sub);
    const payload = { email: user.email, sub: user.id, role: user.role };

    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_ACCESS_SECRET || 'jwt-access-secret',
      expiresIn: '15m',
    });

    return { accessToken };
  }

  async logout(refreshToken: string): Promise<void> {
    await this.refreshTokenRepository.update(
      { token: refreshToken },
      { isRevoked: true },
    );
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return user;
  }

  async validateRefreshToken(token: string, userId: number): Promise<boolean> {
    const refreshToken = await this.refreshTokenRepository.findOne({
      where: { token, userId, isRevoked: false },
    });

    if (!refreshToken) {
      return false;
    }

    return refreshToken.expiresAt > new Date();
  }

  private async storeRefreshToken(
    token: string,
    userId: number,
  ): Promise<void> {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    const refreshToken = this.refreshTokenRepository.create({
      token,
      userId,
      expiresAt,
    });

    await this.refreshTokenRepository.save(refreshToken);
  }
}
