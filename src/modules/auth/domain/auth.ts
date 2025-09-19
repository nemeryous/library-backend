import { User } from 'src/modules/user/domain/user';

export class Auth {
  readonly accessToken: string;
  readonly refreshToken: string;
  readonly user: User;
}
