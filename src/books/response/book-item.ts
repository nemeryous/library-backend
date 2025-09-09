import { ApiProperty } from '@nestjs/swagger';
import { Book } from '../book.entity';

export class BookItem {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;
  
  @ApiProperty()
  ean13: string;

  static toBookItem(book: Book): BookItem {
    const { id, name, ean13 } = book;
    return { id, name, ean13 };
  }
}
