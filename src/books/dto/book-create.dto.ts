import { ApiProperty } from '@nestjs/swagger';

export class BookCreateDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  code: string;

  @ApiProperty({ default: true })
  available?: boolean;

  @ApiProperty()
  author: string;

  @ApiProperty()
  publisher: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  category: string;
}
