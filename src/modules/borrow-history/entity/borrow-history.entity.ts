import { BookEntity } from '../../book/entity/book.entity';
import { UserEntity } from '../../user/entity/user.entity';
import { BorrowStatusEnum } from '../../../utils/BorrowStatusEnum';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('borrow_history')
export class BorrowHistoryEntity {
  @PrimaryGeneratedColumn()
  readonly id: number;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'userId' })
  readonly user: UserEntity;

  @ManyToOne(() => BookEntity)
  @JoinColumn({ name: 'bookId' })
  readonly book: BookEntity;

  @CreateDateColumn()
  readonly borrowDate: Date;

  @Column({ type: 'timestamp', nullable: true })
  readonly returnDate?: Date;

  @Column({ default: BorrowStatusEnum.BORROWED })
  readonly status: BorrowStatusEnum;
}
