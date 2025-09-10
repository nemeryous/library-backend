import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BookEntity } from './book.entity';
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
    const books = await this.bookRepository.find();

    return Book.fromEntities(books);
  }

  async findOne(id: number): Promise<Book> {
    const book = await this.findOneOrThrow(id);

    return Book.fromEntity(book);
  }

  async update(id: number, bookUpdate: BookUpdate): Promise<Book> {
    await this.bookRepository.update(id, BookUpdate.toEntity(bookUpdate));
    const updatedBook = await this.findOneOrThrow(id);

    return Book.fromEntity(updatedBook);
  }

  async remove(id: number): Promise<void> {
    const book = await this.findOneOrThrow(id);

    await this.bookRepository.delete(id);
  }

  async findAvailableBooks(): Promise<Book[]> {
    const books = await this.bookRepository.findBy({
      available: true,
    });

    return Book.fromEntities(books);
  }
}
