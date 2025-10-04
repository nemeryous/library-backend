import { User } from '../../user/domain/user';
import { KeycloakLogin } from '../domain/keycloak-login';
export class KeycloakLoginDto {
  success: boolean;
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
  user: User;

  static fromKeycloakLogin(response: KeycloakLogin): KeycloakLoginDto {
    return {
      success: response.success,
      access_token: response.access_token,
      refresh_token: response.refresh_token,
      token_type: response.token_type,
      expires_in: response.expires_in,
      user: response.user,
    };
  }
}