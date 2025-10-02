import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BorrowHistoryDto } from '../borrow-history/dto/borrow-history.dto';
import { BookEntity } from '../book/entity/book.entity';
import { EmailModule } from '../email/email.module';
import { BorrowHistoryModule } from '../borrow-history/borrow-history.module';
import { ScheduleModule } from '@nestjs/schedule';
import { OverdueReminderScheduler } from './overdue-reminder-scheduler.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([BorrowHistoryDto, BookEntity]),
    EmailModule,
    BorrowHistoryModule,
    ScheduleModule.forRoot()
  ],
  providers: [OverdueReminderScheduler],
  exports: [OverdueReminderScheduler]
})
export class SchedulerModule { }
