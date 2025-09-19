import { ApiProperty } from '@nestjs/swagger';
import { Book } from '../domain/book';

export class BookDetailDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  code: string;

  @ApiProperty()
  available: boolean;

  @ApiProperty()
  author: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  category: string;

  static fromBook(book: Book): BookDetailDto {
    return {
      id: book.id,
      name: book.name,
      code: book.code,
      available: book.available,
      author: book.author,
      description: book.description,
      category: book.category,
    };
  }

  static fromBooks(books: Book[]): BookDetailDto[] {
    return books.map((book) => this.fromBook(book));
  }
}
