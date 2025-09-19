import { ApiProperty } from '@nestjs/swagger';
import { User } from '../domain/user';
import { UserRole } from 'src/modules/auth/enum/user-role';

export class UserResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  role: UserRole;

  static fromUser(user: User): UserResponseDto {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
  }

  static fromUsers(users: User[]): UserResponseDto[] {
    return users.map(this.fromUser);
  }
}
