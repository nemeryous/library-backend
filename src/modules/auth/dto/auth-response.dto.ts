import { UserResponseDto } from 'src/modules/user/dto/user.response.dto';
import { Auth } from '../domain/auth';

export class AuthResponseDto {
  readonly accessToken: string;

  readonly refreshToken: string;
  
  readonly user: UserResponseDto;

  static fromAuth(auth: Auth): AuthResponseDto {
    return {
      accessToken: auth.accessToken,
      refreshToken: auth.refreshToken,
      user: UserResponseDto.fromUser(auth.user),
    };
  }
}
