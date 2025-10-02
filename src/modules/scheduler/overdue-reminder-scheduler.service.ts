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
      this.logger.log('Starting to send overdue reminders');

      await this.borrowHistoryService.checkAndSendOverdueReminders();
      
      this.logger.log('Finished sending overdue reminders');
    } catch (error) {
      this.logger.error('Error sending overdue reminders', error);
    }
  }
}
