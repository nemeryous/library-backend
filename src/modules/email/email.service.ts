import { Injectable, Logger, OnModuleInit } from '@nestjs/common';

import { User } from '../user/domain/user';
import { Book } from '../book/domain/book';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import path from 'path';
import * as fs from 'fs/promises';

@Injectable()
export class EmailService implements OnModuleInit {

  private readonly logger = new Logger(EmailService.name);
  private transporter: nodemailer.Transporter;

  constructor(
    private readonly configService: ConfigService
  ) {
  }

  async onModuleInit() {
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
      this.logger.warn('GMAIL_USER or GMAIL_PASSWORD is not set. Email functionality will be disabled.');
    }
  }

  async sendOverdueReminder(user: User, book: Book, daysOverdue: number): Promise<void> {
    if (!this.transporter) {
      this.logger.error('Cannot send email, transporter is not configured.');

      return;
    }
    try {
      const templateData = {
        userName: user.firstName,
        bookName: book.name,
        daysOverdue: daysOverdue.toString(),
      };

      const { subject, html } = await this.renderTemplate('overdue-reminder', templateData);

      const mailOptions = {
        from: `"Thư viện Library" <${process.env.GMAIL_USER}>`,
        to: user.email,
        subject: subject,
        html: html,
      };


      await this.transporter.sendMail(mailOptions);

      this.logger.log(`Sent overdue reminder to ${user.email} for book "${book.name}"`);
    } catch (error) {
      this.logger.error(`Failed to send email to ${user.email}`, error.stack);
    }
  }

  private async renderTemplate(
    templateName: string,
    data: Record<string, string>,
  ): Promise<{ subject: string; html: string }> {
    const templatePath = path.join(__dirname, '..', '..', 'templates', 'email', `${templateName}.template.html`);
    const initialContent = await fs.readFile(templatePath, 'utf-8');

    const titleMatch = initialContent.match(/<title>(.*?)<\/title>/);
    const initialSubject = titleMatch ? titleMatch[1] : 'No Subject';
    const initialHtml = initialContent.replace(/<title>.*?<\/title>/, '');

    const finalHtml = Object.entries(data).reduce((currentHtml, [key, value]) => {
      const regex = new RegExp(`{{\\s*${key}\\s*}}`, 'g');

      return currentHtml.replace(regex, value);
    }, initialHtml);

    const finalSubject = Object.entries(data).reduce((currentSubject, [key, value]) => {
      const regex = new RegExp(`{{\\s*${key}\\s*}}`, 'g');

      return currentSubject.replace(regex, value);
    }, initialSubject);

    return { subject: finalSubject, html: finalHtml };
  }
}
