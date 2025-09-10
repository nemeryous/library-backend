import { ApiProperty } from '@nestjs/swagger';

export class UserRequestDto {
  @ApiProperty()
  readonly name: string;
  
  @ApiProperty()
  readonly email: string;
}
