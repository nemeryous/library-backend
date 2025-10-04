import { UserEntity } from '../entity/user.entity';

export class UserRequest {
  readonly firstName: string;
  readonly lastName: string;
  readonly email: string;
  readonly keycloakId?: string;
  static toEntity(request: UserRequest): Partial<UserEntity> {
    return {
      firstName: request.firstName,
      lastName: request.lastName,
      email: request.email,
      keyCloakId: request.keycloakId,
    };
  }
}
