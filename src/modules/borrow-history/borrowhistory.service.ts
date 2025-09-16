import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BorrowHistoryEntity } from './entity/borrow-history.entity';
import { Repository } from 'typeorm';
import { BorrowHistory } from './domain/borrow-history';
import { BorrowBook } from './domain/borrow-book.';
import { BookEntity } from '../book/entity/book.entity';
import { UserEntity } from '../user/entity/user.entity';
import { BorrowStatusEnum } from 'src/utils/BorrowStatusEnum';

@Injectable()
export class BorrowHistoryService {
  constructor(
    @InjectRepository(BorrowHistoryEntity)
    private readonly borrowHistoryRepository: Repository<BorrowHistoryEntity>,

    @InjectRepository(BookEntity)
    private readonly bookRepository: Repository<BookEntity>,

    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

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
        book,
        user,
        borrowDate: new Date(),
      }),
    );

    await this.bookRepository.save({ ...book, available: false });

    return BorrowHistory.fromEntity(entity);
  }

  async returnBook(id: number): Promise<BorrowHistory> {
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
    if (!book) {
      throw new NotFoundException(`Book not found in borrow history`);
    }

    await this.bookRepository.save({ ...book, available: true });

    return BorrowHistory.fromEntity(updatedEntity);
  }

  private async findOneOrThrow(id: number): Promise<BorrowHistoryEntity> {
    const entity = await this.borrowHistoryRepository.findOne({
      where: { id },
      relations: ['book', 'user'],
    });
    if (!entity) {
      throw new NotFoundException(`Borrow history with ID ${id} not found`);
    }

    return entity;
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
