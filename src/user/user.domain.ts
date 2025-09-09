import { UserEntity } from "./user.entity";

export class User {

  id: number;
  name: string;
  email: string;

  static fromEntities(user: UserEntity): User {
    return {

      id: user.id,

      name: user.name,

      email: user.email,

    }
  }
}
