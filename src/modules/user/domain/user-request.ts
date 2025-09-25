import { UserEntity } from '../entity/user.entity';

export class UserRequest {
  readonly firstName: string;
  readonly lastName: string;
  readonly email: string;

  static toEntity(request: UserRequest): Partial<UserEntity> {
    return {
      firstName: request.firstName,
      lastName: request.lastName,
      email: request.email,
    };
  }
}
