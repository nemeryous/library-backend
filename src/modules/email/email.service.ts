import { Injectable, Logger } from '@nestjs/common';

import { User } from '../user/domain/user';
import { Book } from '../book/domain/book';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailService {

  private readonly logger = new Logger(EmailService.name);
  private readonly transporter: nodemailer.Transporter;

  constructor(
    private readonly configService: ConfigService
  ) {

    const gmailUser = this.configService.get<string>('GMAIL_USER');
    const gmailPassword = this.configService.get<string>('GMAIL_PASSWORD');

    if (gmailUser && gmailPassword) {
      this.transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
          user: gmailUser,
          pass: gmailPassword,
        },
      });
    } else {
      this.logger.warn('EmailService has been initialized.', gmailUser, gmailPassword);
    }
  }

  async sendOverdueReminder(user: User, book: Book, daysOverdue: number): Promise<void> {
    if (!this.transporter) {
      this.logger.error('Cannot send email, transporter is not configured.');
      return;
    }

    const subject = `[Thư viện] Nhắc nhở trả sách: "${book.name}"`;
    const html = `
      <h1>Xin chào ${user.firstName},</h1>
      <p>Chúng tôi gửi email này để nhắc nhở bạn rằng cuốn sách <strong>"${book.name}"</strong> bạn mượn đã quá hạn trả <strong>${daysOverdue} ngày</strong>.</p>
      <p>Vui lòng sắp xếp thời gian để trả lại sách sớm nhất có thể để các bạn đọc khác có cơ hội mượn.</p>
      <p>Trân trọng,<br>Đội ngũ Thư viện.</p>
    `;

    const mailOptions = {
      from: `"Thư viện Library" <${process.env.GMAIL_USER}>`,
      to: user.email,
      subject: subject,
      html: html,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      this.logger.log(`Sent overdue reminder to ${user.email} for book "${book.name}"`);
    } catch (error) {
      this.logger.error(`Failed to send email to ${user.email}`, error.stack);
    }
  }
}
