import { ApiProperty } from '@nestjs/swagger';
import { UserRequest } from '../domain/user-request';

export class UserRequestDto {
  @ApiProperty()
  readonly firstName: string;

  @ApiProperty()
  readonly lastName: string;

  @ApiProperty()
  readonly email: string;

  static toUserRequest(dto: UserRequestDto): UserRequest {
    return {
      firstName: dto.firstName,
      lastName: dto.lastName,
      email: dto.email,
    };
  }
}
