import { BadRequestException, Injectable } from '@nestjs/common';
import { KeycloakService } from '../keycloak/keycloak.service';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../user/entity/user.entity';
import { Repository } from 'typeorm';
import { ApiConfigService } from 'src/shared/services/api-config.service';
import { RegisterForm } from './domain/register-form';
import { AuthResult } from './domain/auth-result';
import { LoginForm } from './domain/login-form';
import { Token } from './domain/token';
import { jwtDecode } from 'jwt-decode';
import { TokenPayload } from './domain/token-payload';
import { RefreshTokenForm } from './domain/refresh-token-form';

@Injectable()
export class AuthService {
  constructor(
    private readonly keycloakService: KeycloakService,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly apiConfigService: ApiConfigService,
  ) {}

  async register(registerForm: RegisterForm): Promise<AuthResult> {
    if (await this.userRepository.findOneBy({ email: registerForm.email })) {
      throw new BadRequestException(
        `Email ${registerForm.email} đã được sử dụng`,
      );
    }

    const { id } = await this.keycloakService.createUser({
      email: registerForm.email,
      firstName: registerForm.firstName,
      lastName: registerForm.lastName,
      password: registerForm.password,
    });

    const user = await this.userRepository.save({
      keycloakId: id,
      ...registerForm,
    });

    const token = await this.keycloakService.login({
      email: registerForm.email,
      password: registerForm.password,
    });

    return {
      user,
      token,
    };
  }

  async login(login: LoginForm): Promise<AuthResult> {
    return await this.createTokenForUser(
      await this.keycloakService.login(login),
    );
  }

  async refreshToken(refreshTokenForm: RefreshTokenForm): Promise<AuthResult> {
    return await this.createTokenForUser(
      await this.keycloakService.refreshAccessToken(
        refreshTokenForm.refreshToken,
      ),
    );
  }

  private async createTokenForUser(
    token: Token,
    userOptional: Partial<UserEntity> = {},
  ): Promise<AuthResult> {
    const tokenPayload = jwtDecode<TokenPayload>(token.accessToken);

    const user = await this.userRepository.save({
      ...(await this.findOrCreateUser(tokenPayload.sub)),
      ...this.extractUserInfoFromToken(tokenPayload),
      ...userOptional,
    });

    return {
      token,
      user,
    };
  }

  private extractUserInfoFromToken(token: TokenPayload): Partial<UserEntity> {
    return {
      email: token.email,
      firstName: token.given_name,
      lastName: token.family_name,
    };
  }

  private async findOrCreateUser(keyCloakId: string): Promise<UserEntity> {
    const user = await this.userRepository.findOneBy({
      keyCloakId,
    });

    return (
      user ??
      this.userRepository.create({
        keyCloakId,
      })
    );
  }
}
