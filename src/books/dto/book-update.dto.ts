import { ApiProperty } from '@nestjs/swagger';

export class BookUpdateDto {
  @ApiProperty({ required: false })
  name: string;

  @ApiProperty({ required: false })
  available?: boolean;

  @ApiProperty({ required: false })
  author?: string;

  @ApiProperty({ required: false })
  publisher?: string;

  @ApiProperty({ required: false })
  description?: string;

  @ApiProperty({ required: false })
  category?: string;
}
