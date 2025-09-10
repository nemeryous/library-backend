import { BookEntity } from "../book.entity";

export class Book {
  id: number;
  name: string;
  code: string;
  available: boolean;
  author: string;
  publisher: string;
  description: string;
  category: string;

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
    }
  }

  static fromEntities(books: BookEntity[]): Book[] {
    return books.map(this.fromEntity);
  }


}
