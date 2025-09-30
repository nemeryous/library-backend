import { ApiProperty } from '@nestjs/swagger';

export class BookExcelRowDto {
  @ApiProperty()
  readonly name: string;

  @ApiProperty({ required: false })
  readonly available?: boolean;

  @ApiProperty()
  readonly author: string;

  @ApiProperty()
  readonly publisher: string;

  @ApiProperty()
  readonly description: string;

  @ApiProperty()
  readonly category: string;
}
