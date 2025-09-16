import { UserEntity } from "../entity/user.entity";

export class UserRequest {
  readonly name: string;
  readonly email: string;

  static toEntity(request: UserRequest): Partial<UserEntity> {
    return {
      name: request.name,
      email: request.email,
    };
  }
}
