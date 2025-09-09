import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BookEntity } from './book.entity';
import { BookCreateDto } from './dto/book-create.dto';
import { BookUpdateDto } from './dto/book-update.dto';
import { Book } from './book.domain';
import { generateEAN13 } from 'src/utils/helpers';

@Injectable()
export class BookService {
  constructor(
    @InjectRepository(BookEntity)
    private readonly booksRepository: Repository<BookEntity>,
  ) { }


  async create(createBookDto: BookCreateDto): Promise<Book> {
    const code = await generateEAN13();
    const book = this.booksRepository.create({ ...createBookDto, code });

    return Book.fromEntities(await this.booksRepository.save(book));
  }

  async findAll(): Promise<Book[]> {
    const books = await this.booksRepository.find();

    return books.map(Book.fromEntities);
  }

  async findOne(id: number): Promise<Book> {
    const book = await this.booksRepository.findOneBy({ id });

    if (!book) {
      throw new NotFoundException(`Book with id ${id} not found`);
    }

    return Book.fromEntities(book);
  }

  async update(id: number, updateBookDto: BookUpdateDto): Promise<Book> {
    await this.booksRepository.update(id, updateBookDto);
    const updatedBook = await this.booksRepository.findOneBy({ id });

    if (!updatedBook) {
      throw new NotFoundException(`Book with id ${id} not found`);
    }

    return Book.fromEntities(updatedBook);
  }

  async remove(id: number): Promise<void> {
    const book = await this.booksRepository.findOneBy({ id });

    if (!book) {
      throw new NotFoundException(`Book with id ${id} not found`);
    }

    await this.booksRepository.delete(id);
  }

  async findAvailableBooks(): Promise<Book[]> {
    const books = await this.booksRepository.find({
      where: { available: true },
    });

    return books.map(Book.fromEntities);
  }
}
