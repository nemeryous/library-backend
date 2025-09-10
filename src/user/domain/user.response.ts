import { ApiProperty } from '@nestjs/swagger';
import { User } from './user.domain';

export class UserResponse {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;

  static fromUser(user: User): UserResponse {
    return {
      id: user.id,

      name: user.name,

      email: user.email,
    };
  }

  static fromUsers(users: User[]): UserResponse[] {
    return users.map(this.fromUser);
  }
}
