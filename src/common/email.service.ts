import { Injectable } from "@nestjs/common";
import { Transporter } from "nodemailer";
import * as nodemailer from 'nodemailer';
import { UserEntity } from '../modules/user/entity/user.entity';
import { BookEntity } from '../modules/book/entity/book.entity';

@Injectable()
export class EmailService {

  private readonly transporter: Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.GMAIL_USER || 'your-email@gmail.com',
        pass: process.env.GMAIL_PASSWORD || 'your-email-password',
      },
    });
  }

  async sendOverdueReminder(user: UserEntity, book: BookEntity, daysOverdue: number): Promise<void> {
    if (!this.transporter) {
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
    } catch (error) {
      // Handle error
    }
  }

}