import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { BookEntity } from './entity/book.entity';
import { BookCreate } from './domain/book-create';
import { Book } from './domain/book';
import { BookUpdate } from './domain/book-update';
import { generateEAN13 } from 'src/utils/helpers';

@Injectable()
export class BookService {
  constructor(
    @InjectRepository(BookEntity)
    private readonly bookRepository: Repository<BookEntity>,
  ) {}

  async create(bookCreate: BookCreate): Promise<Book> {
    return Book.fromEntity(
      await this.bookRepository.save(
        this.bookRepository.create({
          ...BookCreate.toEntity(bookCreate),
          code: await this.generateUniqueEAN13(),
        }),
      ),
    );
  }

  async findAll(): Promise<Book[]> {
    return Book.fromEntities(await this.bookRepository.find());
  }

  async findOne(id: number): Promise<Book> {
    return Book.fromEntity(await this.findOneOrThrow(id));
  }

  async update(id: number, bookUpdate: BookUpdate): Promise<Book> {
    return Book.fromEntity(
      await this.bookRepository.save({
        ...(await this.findOneOrThrow(id)),
        ...BookUpdate.toEntity(bookUpdate),
      }),
    );
  }

  async remove(id: number): Promise<void> {
    await this.bookRepository.remove(await this.findOneOrThrow(id));
  }

  async findAvailableBooks(): Promise<Book[]> {
    return Book.fromEntities(
      await this.bookRepository.findBy({
        available: true,
      }),
    );
  }

  async findAvailableBooksByName(name: string): Promise<Book[]> {
    return Book.fromEntities(
      await this.bookRepository.findBy({
        name: Like(`%${name}%`),
        available: true,
      }),
    );
  }

  private async generateUniqueEAN13(): Promise<string> {
    const code = generateEAN13();
    const existing = await this.bookRepository.findOneBy({ code });

    return existing ? this.generateUniqueEAN13() : code;
  }

  private async findOneOrThrow(id: number): Promise<BookEntity> {
    const book = await this.bookRepository.findOneBy({ id });

    if (!book) {
      throw new NotFoundException(`Book with id ${id} not found`);
    }

    return book;
  }
}
