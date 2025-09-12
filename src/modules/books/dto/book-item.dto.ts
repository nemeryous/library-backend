import { ApiProperty } from '@nestjs/swagger';
import { Book } from '../domain/book';

export class BookItemDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  code: string;

  static fromBook(book: Book): BookItemDto {
    return {
      id: book.id,
      name: book.name,
      code: book.code,
    };
  }

  static fromBooks(books: Book[]): BookItemDto[] {
    return books.map((e) => this.fromBook(e));
  }
}
