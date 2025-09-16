import { ApiProperty } from '@nestjs/swagger';
import { BorrowHistory } from '../domain/borrow-history';
export class BorrowHistoryDto {
  @ApiProperty()
  readonly id: number;

  @ApiProperty()
  readonly userId: number;

  @ApiProperty()
  readonly bookId: number;

  @ApiProperty()
  readonly borrowDate: Date;

  @ApiProperty({ required: false })
  readonly returnDate?: Date;

  @ApiProperty()
  readonly status: string;

  static fromBorrowHistory(borrowHistory: BorrowHistory): BorrowHistoryDto {
    return {
      id: borrowHistory.id,
      userId: borrowHistory.userId,
      bookId: borrowHistory.bookId,
      borrowDate: borrowHistory.borrowDate,
      returnDate: borrowHistory.returnDate,
      status: borrowHistory.status,
    };
  }

  static fromBorowHistories(
    borrowHistories: BorrowHistory[],
  ): BorrowHistoryDto[] {
    return borrowHistories.map((e) => this.fromBorrowHistory(e));
  }
}
