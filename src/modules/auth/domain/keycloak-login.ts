import { User } from '../../user/domain/user';

export class KeycloakLogin {
  success: boolean;
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
  user: User;
}