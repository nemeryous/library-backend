import { UserEntity } from "../entity/user.entity";

export class User {
  id: number;
  name: string;
  email: string;

  static fromEntity(user: UserEntity): User {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
    };
  }

  static fromEntities(users: UserEntity[]): User[] {
    return users.map(this.fromEntity);
  }
}
