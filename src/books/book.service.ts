import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BookEntity } from './book.entity';
import { BookCreateDto } from './dto/book-create.dto';
import { BookUpdateDto } from './dto/book-update.dto';
import { generateEAN13 } from 'src/utils/helpers';
import { Book } from './domain/book.domain';
import { BookCreate } from './domain/book-create';
import { BookUpdate } from './domain/book-update';

@Injectable()
export class BookService {
  constructor(
    @InjectRepository(BookEntity)
    private readonly bookRepository: Repository<BookEntity>,
  ) { }

  async create(bookCreate: BookCreate): Promise<Book> {
    let ean: string;
    let exists: BookEntity | null;

    do {
      ean = await generateEAN13();
      exists = await this.bookRepository.findOne({ where: { code: ean } });
    } while (exists);

    return Book.fromEntity(
      await this.bookRepository.save(
        this.bookRepository.create({
          ...bookCreate,
          code: ean
        })
      ),
    );

  }

  async findAll(): Promise<Book[]> {
    const books = await this.bookRepository.find();

    return Book.fromEntities(books);
  }

  async findOne(id: number): Promise<Book> {
    const book = await this.bookRepository.findOneBy({ id });

    if (!book) {
      throw new NotFoundException(`Book with id ${id} not found`);
    }

    return Book.fromEntity(book);
  }

  async update(id: number, bookUpdate: BookUpdate): Promise<Book> {
    await this.bookRepository.update(id, bookUpdate);
    const updatedBook = await this.bookRepository.findOneBy({ id });

    if (!updatedBook) {
      throw new NotFoundException(`Book with id ${id} not found`);
    }

    return Book.fromEntity(updatedBook);
  }

  async remove(id: number): Promise<void> {
    const book = await this.bookRepository.findOneBy({ id });

    if (!book) {
      throw new NotFoundException(`Book with id ${id} not found`);
    }

    await this.bookRepository.delete(id);
  }

  async findAvailableBooks(): Promise<Book[]> {
    const books = await this.bookRepository.find({
      where: { available: true },
    });

    return Book.fromEntities(books);
  }
}
