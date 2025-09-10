import { BookEntity } from '../book.entity';

export class BookCreate {
  readonly name: string;

  readonly available?: boolean;

  readonly author: string;

  readonly publisher: string;

  readonly description: string;

  readonly category: string;

  static toEntity(bookCreate: BookCreate): Partial<BookEntity> {
    return {
      name: bookCreate.name,
      available: bookCreate.available ?? true,
      author: bookCreate.author,
      publisher: bookCreate.publisher,
      description: bookCreate.description,
      category: bookCreate.category,
    };
  }
}
