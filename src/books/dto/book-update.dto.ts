import { ApiProperty } from '@nestjs/swagger';

export class BookUpdateDto {
  @ApiProperty()
  name: string;
  @ApiProperty()
  available?: boolean;
}
