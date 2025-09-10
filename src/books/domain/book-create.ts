import { BookCreateDto } from "../dto/book-create.dto";

export class BookCreate {
  readonly name: string;

  readonly available?: boolean;

  readonly author: string;

  readonly publisher: string;

  readonly description: string;

  readonly category: string;

  static fromBookCreateDto(bookCreateDto: BookCreateDto): BookCreate {

    return {
      name: bookCreateDto.name,
      available: bookCreateDto.available,
      author: bookCreateDto.author,
      publisher: bookCreateDto.publisher,
      description: bookCreateDto.description,
      category: bookCreateDto.category,
    };
  }
}