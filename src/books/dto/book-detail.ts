import { ApiProperty } from '@nestjs/swagger';
import { Book } from '../domain/book.domain';

export class BookDetailDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  ean13: string;

  @ApiProperty()
  available: boolean;

  @ApiProperty()
  author: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  category: string;

  static toBookDetail(book: Book): BookDetailDto {
    return {
      id: book.id,
      name: book.name,
      ean13: book.code,
      available: book.available,
      author: book.author,
      description: book.description,
      category: book.category,
    };
  }
}
