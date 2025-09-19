import { ApiProperty } from '@nestjs/swagger';
import { UserRequest } from '../domain/user-request';

export class UserRequestDto {
  @ApiProperty()
  readonly name: string;

  @ApiProperty()
  readonly email: string;

  @ApiProperty()
  readonly password: string;

  static toUserRequest(dto: UserRequestDto): UserRequest {
    return {
      name: dto.name,
      email: dto.email,
      password: dto.password,
    };
  }
}
