import { BookEntity } from "./book.entity";

export class Book {
  id: number;
  name: string;
  code: string;
  available: boolean;
  author: string;
  publisher: string;
  description: string;
  category: string;

  static fromEntities(book: BookEntity): Book {
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
}
