import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class RefreshTokenDto {
  @IsNotEmpty()
  @ApiProperty()
  @IsString()
  readonly refreshToken: string;
}
