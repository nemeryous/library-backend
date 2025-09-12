import { ApiProperty } from '@nestjs/swagger';
import { BookUpdate } from '../domain/book-update';

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

  static toBookUpdate(bookUpdateDto: BookUpdateDto): BookUpdate {
    return {
      name: bookUpdateDto.name,
      available: bookUpdateDto.available,
      author: bookUpdateDto.author,
      publisher: bookUpdateDto.publisher,
      description: bookUpdateDto.description,
      category: bookUpdateDto.category,
    };
  }
}
