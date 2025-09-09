import { ApiProperty } from '@nestjs/swagger';
import { User } from '../user.entity';

export class UserResponse {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;

  static toUserResponse(user: User): UserResponse {
    const { id, name, email } = user;
    return { id, name, email };
  }
}
