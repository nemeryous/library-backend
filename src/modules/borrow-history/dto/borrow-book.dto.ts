import { BorrowBook } from '../domain/borrow-book.';

export class BorrowBookDto {
  readonly userId: number;
  readonly bookId: number;

  static toBorrowBook(dto: BorrowBookDto): BorrowBook {
    return {
      userId: dto.userId,
      bookId: dto.bookId,
    };
  }
}
