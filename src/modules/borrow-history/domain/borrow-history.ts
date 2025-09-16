import { BorrowStatusEnum } from 'src/utils/BorrowStatusEnum';
import { BorrowHistoryEntity } from '../entity/borrow-history.entity';

export class BorrowHistory {
  readonly id: number;

  readonly userId: number;

  readonly bookId: number;

  readonly borrowDate: Date;

  readonly returnDate?: Date;

  readonly status: BorrowStatusEnum;

  static fromEntity(entity: BorrowHistoryEntity): BorrowHistory {
    return {
      id: entity.id,
      userId: entity.user.id,
      bookId: entity.book.id,
      borrowDate: entity.borrowDate,
      returnDate: entity.returnDate,
      status: entity.status,
    };
  }

  static fromEntities(entities: BorrowHistoryEntity[]): BorrowHistory[] {
    return entities.map((e) => this.fromEntity(e));
  }
}
