import { BookBorrowHistory } from '../domain/book-borrow-history';
import { BorrowHistory } from '../domain/borrow-history';

export class BookBorrowHistoryDto {
  available: boolean;
  borrowHistories: BorrowHistory[];

  static fromBookBorrowHistory(dto: BookBorrowHistory): BookBorrowHistoryDto {
    return {
      ...dto,
    };
  }
}
