import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book } from './book.entity';
import { BookCreateDto } from './dto/book-create.dto';
import { BookUpdateDto } from './dto/book-update.dto';
import { BookItem } from './response/book-item';
import { BookDetail } from './response/book-detail';

@Injectable()
export class BookService {
  constructor(
    @InjectRepository(Book)
    private booksRepository: Repository<Book>,
  ) {}

  async generateEAN13(): Promise<string> {
    let ean = '';

    for (let i = 0; i < 13; i++) {
      ean += Math.floor(Math.random() * 10);
    }

    const exists = await this.booksRepository.findOne({
      where: { code: ean },
    });

    if (exists) return this.generateEAN13();

    return ean;
  }

  async create(createBookDto: BookCreateDto): Promise<Book> {
    const code = await this.generateEAN13();
    const book = this.booksRepository.create({ ...createBookDto, code });

    return await this.booksRepository.save(book);
  }

  async findAll(): Promise<Book[]> {
    return await this.booksRepository.find();
  }

  async findOne(id: number): Promise<Book> {
    const book = await this.booksRepository.findOneBy({ id });

    if (!book) {
      throw new NotFoundException(`Book with id ${id} not found`);
    }

    return book;
  }

  async update(id: number, updateBookDto: BookUpdateDto): Promise<Book> {
    await this.booksRepository.update(id, updateBookDto);
    const updatedBook = await this.booksRepository.findOneBy({ id });

    if (!updatedBook) {
      throw new NotFoundException(`Book with id ${id} not found`);
    }

    return updatedBook;
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

    return books;
  }
}
