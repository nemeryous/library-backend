import { ApiProperty } from '@nestjs/swagger';
import { RoleType } from '../../../guards/role-type';
import { UserEntity } from '../../user/entity/user.entity';

export class CurrentUserDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  email: string;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  fullName: string;

  @ApiProperty()
  role: RoleType;

  public static fromUser(user: UserEntity): CurrentUserDto {
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      fullName: `${user.firstName} ${user.lastName}`,
      role: user.role,
    };
  }
}
