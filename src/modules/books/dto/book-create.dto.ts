import { ApiProperty } from '@nestjs/swagger';
import { BookCreate } from '@book/domain/book-create';

export class BookCreateDto {
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

  static toBookCreate(bookCreateDto: BookCreateDto): BookCreate {
    return {
      name: bookCreateDto.name,
      available: bookCreateDto.available,
      author: bookCreateDto.author,
      publisher: bookCreateDto.publisher,
      description: bookCreateDto.description,
      category: bookCreateDto.category,
    };
  }
}
