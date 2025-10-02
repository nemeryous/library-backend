import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BorrowHistoryEntity } from './entity/borrow-history.entity';
import { BookEntity } from '../book/entity/book.entity';
import { UserEntity } from '../user/entity/user.entity';
import { BorrowHistoryController } from './borrow-history.controller';
import { BorrowHistoryService } from './borrow-history.service';
import { EmailModule } from '../email/email.module';

@Module({
  imports: [TypeOrmModule.forFeature([BorrowHistoryEntity, BookEntity, UserEntity]), EmailModule],
  controllers: [BorrowHistoryController],
  providers: [BorrowHistoryService],
  exports: [BorrowHistoryService],
})
export class BorrowHistoryModule { }
