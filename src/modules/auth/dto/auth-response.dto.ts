import { UserResponseDto } from 'src/modules/user/dto/user.response.dto';

export class AuthResponseDto {
  accessToken: string;
  refreshToken: string;
  user: UserResponseDto;
}
