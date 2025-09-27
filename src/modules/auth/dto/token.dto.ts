import { Token } from '../domain/token';

export class TokenDto {
  accessToken: string;
  expiresIn: number;
  refreshExpiresIn: number;
  refreshToken: string;
  tokenType: string;
  sessionState: string;
  scope: string;

  public static fromToken(token: Token): TokenDto {
    return {
      ...token,
    };
  }
}
