import { ApiProperty } from '@nestjs/swagger';
import { Book } from '../domain/book.domain';

export class BookItemDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  ean13: string;

  static fromBook(book: Book): BookItemDto {
    return {
      id: book.id,
      name: book.name,
      ean13: book.code,
    };
  }

  static fromBooks(books: Book[]): BookItemDto[] {
    return books.map(this.fromBook);
  }
}
