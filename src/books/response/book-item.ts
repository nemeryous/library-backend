import { ApiProperty } from '@nestjs/swagger';
import { Book } from '../book.domain';

export class BookItem {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  ean13: string;

  static toBookItem(book: Book): BookItem {
    return {
      id: book.id,
      name: book.name,
      ean13: book.code,
    };
  }
}
