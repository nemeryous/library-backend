import { ApiProperty } from '@nestjs/swagger';
import { User } from '../domain/user';
import { RoleType } from '../../../guards/role-type';

export class UserResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  email: string;

  @ApiProperty({ enum: RoleType })
  role: RoleType;

  @ApiProperty({ required: false })
  keyCloakId?: string;

  static fromUser(user: User): UserResponseDto {
    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      keyCloakId: user.keyCloakId,
    };
  }

  static fromUsers(users: User[]): UserResponseDto[] {
    return users.map(this.fromUser);
  }
}
