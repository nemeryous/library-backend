import { UserEntity } from '../entity/user.entity';
import { RoleType } from '../../../guards/role-type';

export class User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: RoleType;
  keyCloakId?: string;

  static fromEntity(user: UserEntity): User {
    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      keyCloakId: user.keyCloakId,
    };
  }

  static fromEntities(users: UserEntity[]): User[] {
    return users.map(this.fromEntity);
  }
}
