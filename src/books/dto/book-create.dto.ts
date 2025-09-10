import { ApiProperty } from '@nestjs/swagger';

export class BookCreateDto {
  @ApiProperty()
  readonly name: string;

  @ApiProperty({ default: true })
  readonly available?: boolean;

  @ApiProperty()
  readonly author: string;

  @ApiProperty()
  readonly publisher: string;

  @ApiProperty()
  readonly description: string;

  @ApiProperty()
  category: string;
}
