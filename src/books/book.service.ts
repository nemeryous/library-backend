import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BookEntity } from './entity/book.entity';
import { generateEAN13 } from 'src/utils/helpers';
import { Book } from './domain/book.domain';
import { BookCreate } from './domain/book-create';
import { BookUpdate } from './domain/book-update';

@Injectable()
export class BookService {
  constructor(
    @InjectRepository(BookEntity)
    private readonly bookRepository: Repository<BookEntity>,
  ) {}

  async create(bookCreate: BookCreate): Promise<Book> {
    const ean = await this.generateUniqueEAN13();
    return Book.fromEntity(
      await this.bookRepository.save(
        this.bookRepository.create({
          ...BookCreate.toEntity(bookCreate),
          code: ean,
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
    const updatedBook = this.bookRepository.save({
      ...this.findOneOrThrow(id),
      ...BookUpdate.toEntity(bookUpdate),
    });
    return Book.fromEntity(await updatedBook);
  }

  async remove(id: number): Promise<void> {
    await this.bookRepository.delete(await this.findOneOrThrow(id));
  }

  async findAvailableBooks(): Promise<Book[]> {
    return Book.fromEntities(
      await this.bookRepository.findBy({
        available: true,
      }),
    );
  }

  private async generateUniqueEAN13(): Promise<string> {
    let ean: string;
    let exists: BookEntity | null;

    do {
      ean = await generateEAN13();
      exists = await this.bookRepository.findOne({ where: { code: ean } });
    } while (exists);

    return ean;
  }

  private async findOneOrThrow(id: number): Promise<BookEntity> {
    const book = await this.bookRepository.findOneBy({ id });
    if (!book) {
      throw new NotFoundException(`Book with id ${id} not found`);
    }

    return book;
  }
}
