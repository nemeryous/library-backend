import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BorrowHistoryDto } from '../borrow-history/dto/borrow-history.dto';
import { BookEntity } from '../book/entity/book.entity';
import { EmailService } from '../email/email.service';
import { SchedulerService } from './scheduler.service';
import { BorrowHistoryService } from '../borrow-history/borrow-history.service';
import { EmailModule } from '../email/email.module';
import { ConfigModule } from '@nestjs/config';
import { BorrowHistoryModule } from '../borrow-history/borrow-history.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    TypeOrmModule.forFeature([BorrowHistoryDto, BookEntity]), EmailModule, BorrowHistoryModule, ScheduleModule.forRoot()
  ],
  controllers: [],
  providers: [SchedulerService],
  exports: [SchedulerService]
})
export class SchedulerModule { }
