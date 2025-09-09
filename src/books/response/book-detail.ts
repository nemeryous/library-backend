import { ApiProperty } from '@nestjs/swagger';
import { Book } from '../book.domain';

export class BookDetail {
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

  static toBookDetails(book: Book): BookDetail {
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
