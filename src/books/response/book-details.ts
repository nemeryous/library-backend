import { ApiProperty } from '@nestjs/swagger';
import { Book } from '../book.entity';

export class BookDetails {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  ean13: string;

  @ApiProperty()
  available: boolean;

  @ApiProperty()
  author: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  category: string;

  static toBookDetails(book: Book): BookDetails {
    const { id, name, ean13, available, author, description, category } = book;
    return { id, name, ean13, available, author, description, category };
  }
}
