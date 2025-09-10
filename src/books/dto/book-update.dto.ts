import { ApiProperty } from '@nestjs/swagger';

export class BookUpdateDto {
  @ApiProperty({ required: false })
  readonly name?: string;

  @ApiProperty({ required: false })
  readonly available?: boolean;

  @ApiProperty({ required: false })
  readonly author?: string;

  @ApiProperty({ required: false })
  readonly publisher?: string;

  @ApiProperty({ required: false })
  readonly description?: string;

  @ApiProperty({ required: false })
  readonly category?: string;
}
