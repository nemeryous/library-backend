import { Injectable, Logger } from '@nestjs/common';
import { BorrowHistoryService } from '../borrow-history/borrow-history.service';
import { Cron, CronExpression } from '@nestjs/schedule';


@Injectable()
export class SchedulerService {
  private readonly logger = new Logger(SchedulerService.name);

  constructor(
    private readonly borrowHistoryService: BorrowHistoryService,
  ) {
  }

  @Cron('08 11 * * *', { name: 'sendOverdueReminders', timeZone: 'Asia/Ho_Chi_Minh' })
  async handleoverdueReminders() {
    this.logger.debug('Running sendOverdueReminders task');

    await this.borrowHistoryService.checkAndSendOverdueReminders();
  }
}
