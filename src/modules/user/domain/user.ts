import { UserRole } from "src/modules/auth/enum/user-role";
import { UserEntity } from "../entity/user.entity";

export class User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  password: string;
  static fromEntity(user: UserEntity): User {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      password: user.password,
    };
  }

  static fromEntities(users: UserEntity[]): User[] {
    return users.map(this.fromEntity);
  }
}
