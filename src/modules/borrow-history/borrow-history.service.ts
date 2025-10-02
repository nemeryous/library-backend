import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BorrowHistoryEntity } from './entity/borrow-history.entity';
import { In, LessThan, Repository } from 'typeorm';
import { BorrowHistory } from './domain/borrow-history';
import { BorrowBook } from './domain/borrow-book';
import { BookEntity } from '../book/entity/book.entity';
import { UserEntity } from '../user/entity/user.entity';
import { BorrowStatusEnum } from 'src/utils/BorrowStatusEnum';
import { Book } from '../book/domain/book';
import { BookBorrowHistory } from './domain/book-borrow-history';
import * as XLSX from 'xlsx';
import { ExcelBorrowHistoryData } from './domain/excel-borrow-history-data';
import { EmailService } from '../email/email.service';
import pLimit from 'p-limit';

@Injectable()
export class BorrowHistoryService {

  private readonly logger = new Logger(BorrowHistoryService.name);


  constructor(
    @InjectRepository(BorrowHistoryEntity)
    private readonly borrowHistoryRepository: Repository<BorrowHistoryEntity>,
    @InjectRepository(BookEntity)
    private readonly bookRepository: Repository<BookEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly emailService: EmailService,
  ) { }

  async findAll(): Promise<BorrowHistory[]> {
    return BorrowHistory.fromEntities(
      await this.borrowHistoryRepository.find(),
    );
  }

  async findById(id: number): Promise<BorrowHistory> {
    return BorrowHistory.fromEntity(await this.findOneOrThrow(id));
  }

  async create(borrowBook: BorrowBook): Promise<BorrowHistory> {
    const book = await this.findBookOrThrow(borrowBook.bookId);
    const user = await this.findUserOrThrow(borrowBook.userId);

    const entity = await this.borrowHistoryRepository.save(
      this.borrowHistoryRepository.create({
        user,
        book,
        userId: user.id,
        bookId: book.id,
        borrowDate: new Date(),
      }),
    );

    await this.bookRepository.save({ ...book, available: false });

    return BorrowHistory.fromEntity(entity);
  }

  async remove(id: number): Promise<BorrowHistory> {
    const entity = await this.findOneOrThrow(id);

    if (entity.status === BorrowStatusEnum.RETURNED) {
      throw new Error(`Book with borrow history ID ${id} is already returned`);
    }

    const updatedEntity = await this.borrowHistoryRepository.save({
      ...entity,
      returnDate: new Date(),
      status: BorrowStatusEnum.RETURNED,
    });

    const book = entity.book;

    await this.bookRepository.save({ ...book, available: true });

    return BorrowHistory.fromEntity(updatedEntity);
  }

  async getBorrowHistoryByCodeEan13(code: string): Promise<BookBorrowHistory> {
    const bookEntity = await this.bookRepository.findOneBy({ code });

    if (!bookEntity) {
      throw new NotFoundException(`Book with code ${code} not found`);
    }

    const borrowHistoryEntities = await this.borrowHistoryRepository.find({
      where: { bookId: bookEntity.id },
      relations: {
        book: true,
        user: true,
      },
      order: { borrowDate: 'DESC' },
    });

    return {
      available: bookEntity.available,
      borrowHistories: BorrowHistory.fromEntities(borrowHistoryEntities),
    };
  }

  private async findOneOrThrow(id: number): Promise<BorrowHistoryEntity> {
    const entity = await this.borrowHistoryRepository.findOne({
      where: { id },
      relations: {
        book: true,
        user: true,
      },
    });

    if (!entity) {
      throw new NotFoundException(`Borrow history with ID ${id} not found`);
    }

    return entity;
  }

  async getBorrowedBooksByUser(userId: number): Promise<Book[]> {
    const borrowHistoryEntities = await this.borrowHistoryRepository.find({
      where: { userId, status: BorrowStatusEnum.BORROWED },
      relations: {
        book: true,
      },
    });

    if (borrowHistoryEntities.length === 0) {
      return [];
    }

    return await this.bookRepository.findBy({
      id: In(borrowHistoryEntities.map((bh) => bh.bookId)),
    });
  }

  async exportByUser(userId: number): Promise<Buffer> {
    const histories = await this.borrowHistoryRepository.find({
      where: { userId },
      relations: { book: true, user: true },
      order: { status: 'ASC', borrowDate: 'DESC' },
    });

    const data = this.prepareDataForExcel(histories);

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Borrow History');

    return XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
  }

  private prepareDataForExcel(histories: BorrowHistoryEntity[]): ExcelBorrowHistoryData[] {
    return histories.map((history) => ({
      Name: history.book.name,
      Code: history.book.code,
      Author: history.book.author,
      Publisher: history.book.publisher,
      Category: history.book.category,
      'Borrow Date': history.borrowDate.toISOString(),
      'Return Date': history.returnDate
        ? history.returnDate.toISOString()
        : 'Not returned',
      Status: history.status,
    }));
  }

  async checkAndSendOverdueReminders(): Promise<void> {
    const twoWeeksAgo = new Date();
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);

    const overdueHistories = await this.borrowHistoryRepository.find({
      where: {
        status: BorrowStatusEnum.BORROWED,
        borrowDate: LessThan(twoWeeksAgo),
      },
      relations: {
        user: true,
        book: true,
      },
      order: { borrowDate: 'ASC' },
    });

    if (overdueHistories.length === 0) {
      this.logger.log('Không tìm thấy sách nào quá hạn.');
      return;
    }

    this.logger.log(`Tìm thấy ${overdueHistories.length} lượt mượn sách quá hạn. Bắt đầu gửi email...`);

    await this.sendRemindersInChunks(overdueHistories);

    this.logger.log('Hoàn thành việc gửi email nhắc nhở.');
  }

  private async sendRemindersInChunks(histories: BorrowHistoryEntity[]): Promise<void> {
    const limit = pLimit(10);

    const emailPromises = histories.map((history) => {
      return limit(() => this.sendReminderForHistory(history));
    });

    await Promise.all(emailPromises);
  }

  private async sendReminderForHistory(history: BorrowHistoryEntity): Promise<void> {
    const today = new Date();
    const borrowDate = new Date(history.borrowDate);
    const daysOverdue = Math.floor((today.getTime() - borrowDate.getTime()) / (1000 * 3600 * 24)) - 14;

    await this.emailService.sendOverdueReminder(history.user, history.book, daysOverdue);
  }



  private async findBookOrThrow(id: number): Promise<BookEntity> {
    const book = await this.bookRepository.findOneBy({ id });

    if (!book) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }

    if (!book.available) {
      throw new Error(`Book with ID ${id} is not available`);
    }

    return book;
  }

  private async findUserOrThrow(id: number): Promise<UserEntity> {
    const user = await this.userRepository.findOneBy({ id });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }
}
