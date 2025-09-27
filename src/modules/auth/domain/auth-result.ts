import { UserEntity } from 'src/modules/user/entity/user.entity';
import { Token } from './token';

export class AuthResult {
  token: Token;

  user: UserEntity;
}
