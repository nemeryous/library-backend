import { ApiProperty } from '@nestjs/swagger';
import { BorrowHistory } from '../domain/borrow-history';
import { UserResponseDto } from 'src/modules/user/dto/user.response.dto';
import { BookItemDto } from 'src/modules/book/dto/book-item.dto';
export class BorrowHistoryDto {
  @ApiProperty()
  readonly id: number;

  @ApiProperty()
  readonly user: UserResponseDto;

  @ApiProperty()
  readonly book: BookItemDto;

  @ApiProperty()
  readonly borrowDate: Date;

  @ApiProperty()
  readonly returnDate?: Date;

  @ApiProperty()
  readonly status: string;

  static fromBorrowHistory(borrowHistory: BorrowHistory): BorrowHistoryDto {
    return {
      id: borrowHistory.id,
      user: UserResponseDto.fromUser(borrowHistory.user),
      book: BookItemDto.fromBook(borrowHistory.book),
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
