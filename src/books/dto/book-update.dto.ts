import { ApiProperty } from '@nestjs/swagger';

export class BookUpdateDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  available?: boolean;

  @ApiProperty()
  author?: string;

  @ApiProperty()
  publisher?: string;

  @ApiProperty()
  description?: string;

  @ApiProperty()
  category?: string;
}
