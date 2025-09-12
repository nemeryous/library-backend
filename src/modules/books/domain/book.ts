import { BookEntity } from '@book/entity/book.entity';

export class Book {
  readonly id: number;

  readonly name: string;

  readonly code: string;

  readonly available: boolean;

  readonly author: string;

  readonly publisher: string;

  readonly description: string;

  readonly category: string;

  static fromEntity(book: BookEntity): Book {
    return {
      id: book.id,
      name: book.name,
      code: book.code,
      available: book.available,
      author: book.author,
      publisher: book.publisher,
      description: book.description,
      category: book.category,
    };
  }

  static fromEntities(books: BookEntity[]): Book[] {
    return books.map((e) => this.fromEntity(e));
  }
}
