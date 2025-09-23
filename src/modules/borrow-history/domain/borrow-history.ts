import { BorrowStatusEnum } from 'src/utils/BorrowStatusEnum';
import { BorrowHistoryEntity } from '../entity/borrow-history.entity';
import { User } from 'src/modules/user/domain/user';
import { Book } from 'src/modules/book/domain/book';

export class BorrowHistory {
  readonly id: number;

  readonly user: User;

  readonly book: Book;

  readonly borrowDate: Date;

  readonly returnDate?: Date;

  readonly status: BorrowStatusEnum;

  static fromEntity(entity: BorrowHistoryEntity): BorrowHistory {
    return {
      id: entity.id,
      user: User.fromEntity(entity.user),
      book: Book.fromEntity(entity.book),
      borrowDate: entity.borrowDate,
      returnDate: entity.returnDate,
      status: entity.status,
    };
  }

  static fromEntities(entities: BorrowHistoryEntity[]): BorrowHistory[] {
    return entities.map((e) => this.fromEntity(e));
  }
}
