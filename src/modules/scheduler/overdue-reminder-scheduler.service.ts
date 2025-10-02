import { Injectable, Logger } from '@nestjs/common';
import { BorrowHistoryService } from '../borrow-history/borrow-history.service';
import { Cron, CronExpression } from '@nestjs/schedule';


@Injectable()
export class OverdueReminderScheduler {
  private readonly logger = new Logger(OverdueReminderScheduler.name);

  constructor(
    private readonly borrowHistoryService: BorrowHistoryService,
  ) {
  }

  @Cron(CronExpression.EVERY_DAY_AT_9AM, { name: 'sendOverdueReminders', timeZone: 'Asia/Ho_Chi_Minh' })
  async handleoverdueReminders() {
    try {
      await this.borrowHistoryService.checkAndSendOverdueReminders();
    } catch (error) {
      this.logger.error('Error sending overdue reminders', error);
    }
  }
}
