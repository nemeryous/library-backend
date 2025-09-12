import { BookEntity } from '../entity/book.entity';

export class BookUpdate {
  readonly name?: string;

  readonly available?: boolean;

  readonly author?: string;

  readonly publisher?: string;

  readonly description?: string;

  readonly category?: string;

  static toEntity(bookUpdate: BookUpdate): Partial<BookEntity> {
    return {
      name: bookUpdate.name,
      available: bookUpdate.available,
      author: bookUpdate.author,
      publisher: bookUpdate.publisher,
      description: bookUpdate.description,
      category: bookUpdate.category,
    };
  }
}
