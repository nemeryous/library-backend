import { BookUpdateDto } from "../dto/book-update.dto";

export class BookUpdate {
  readonly name?: string;

  readonly available?: boolean;

  readonly author?: string;

  readonly publisher?: string;

  readonly description?: string;

  readonly category?: string;

  static fromBookUpdateDto(bookUpdateDto: BookUpdateDto): BookUpdate {
    return {
      name: bookUpdateDto.name,
      available: bookUpdateDto.available,
      author: bookUpdateDto.author,
      publisher: bookUpdateDto.publisher,
      description: bookUpdateDto.description,
      category: bookUpdateDto.category,
    }
  }
}
