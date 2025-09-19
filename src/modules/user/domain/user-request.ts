import { UserEntity } from "../entity/user.entity";

export class UserRequest {
  readonly name: string;
  readonly email: string;
  readonly password: string;
  static toEntity(request: UserRequest): Partial<UserEntity> {
    return {
      name: request.name,
      email: request.email,
      password: request.password,
    };
  }
}
