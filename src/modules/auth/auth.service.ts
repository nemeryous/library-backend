import { BadRequestException, Injectable } from '@nestjs/common';
import { KeycloakService } from '../keycloak/keycloak.service';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../user/entity/user.entity';
import { Repository } from 'typeorm';
import { RegisterForm } from './domain/register-form';
import { AuthResult } from './domain/auth-result';
import { LoginForm } from './domain/login-form';
import { Token } from './domain/token';
import { jwtDecode } from 'jwt-decode';
import { TokenPayload } from './domain/token-payload';
import { RefreshTokenForm } from './domain/refresh-token-form';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { KeycloakLogin } from './domain/keycloak-login';
import { Keycloak } from 'keycloak-connect';


@Injectable()
export class AuthService {
  constructor(
    private readonly keycloakService: KeycloakService,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) { }

  async register(registerForm: RegisterForm): Promise<AuthResult> {
    const user = await this.userRepository.findOneBy({
      email: registerForm.email,
    });
    if (user && user.keyCloakId) {
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

    const updatedUser = await this.updateOrCreateUser(user, id, registerForm);

    const token = await this.keycloakService.login({
      email: registerForm.email,
      password: registerForm.password,
    });

    return {
      user: updatedUser,
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

  async loginWithGoogle(accessToken: string): Promise<KeycloakLogin> {
    const keycloakUser = await this.keycloakService.verifyKeycloakToken(accessToken);

    const existingUser = await this.userRepository.findOneBy({
      email: keycloakUser.email,
    });

    const keycloakAsRegisterForm = {
      email: keycloakUser.email,
      firstName: keycloakUser.firstName,
      lastName: keycloakUser.lastName,
      password: '',
    };

    const user = await this.updateOrCreateUser(
      existingUser,
      keycloakUser.keycloakId,
      keycloakAsRegisterForm
    );

    return this.createKeycloakAuthResponse(user);
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

  private createKeycloakAuthResponse(user: UserEntity): KeycloakLogin {
    const payload = {
      sub: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      keycloakId: user.keyCloakId,
    };

    const accessToken = this.jwtService.sign(payload, { expiresIn: '1h' });
    const refreshToken = this.jwtService.sign(
      { sub: user.id },
      { expiresIn: '7d' }
    );

    return {
      success: true,
      access_token: accessToken,
      refresh_token: refreshToken,
      token_type: 'Bearer',
      expires_in: 3600,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        keyCloakId: user.keyCloakId,
      },
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

  private async updateOrCreateUser(
    existingUser: UserEntity | null,
    keyCloakId: string,
    registerForm: RegisterForm,
  ): Promise<UserEntity> {
    if (existingUser && !existingUser.keyCloakId) {
      existingUser.keyCloakId = keyCloakId;
      existingUser.firstName = registerForm.firstName;
      existingUser.lastName = registerForm.lastName;

      return await this.userRepository.save(existingUser);
    } else if (!existingUser) {
      const newUser = this.userRepository.create({
        keyCloakId,
        firstName: registerForm.firstName,
        lastName: registerForm.lastName,
        email: registerForm.email,
      });

      return await this.userRepository.save(newUser);
    }

    return existingUser;
  }

}
