import { ApiProperty } from '@nestjs/swagger';
import { User } from '../domain/user.domain';

export class UserResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;

  static fromUser(user: User): UserResponseDto {
    return {
      id: user.id,

      name: user.name,

      email: user.email,
    };
  }

  static fromUsers(users: User[]): UserResponseDto[] {
    return users.map(this.fromUser);
  }
}
