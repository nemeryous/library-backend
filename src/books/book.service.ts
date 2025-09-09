import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book } from './books.entity';
import { BookCreateDto } from './dto/book-create.dto';
import { BookUpdateDto } from './dto/book-update.dto';
import { BookItem } from './response/book-item';

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
      where: { ean13: ean },
    });

    if (exists) return this.generateEAN13();

    return ean;
  }

  async create(createBookDto: BookCreateDto): Promise<BookItem> {
    const ean13 = await this.generateEAN13();
    const book = this.booksRepository.create({ ...createBookDto, ean13 });

    return BookItem.toBookItem(await this.booksRepository.save(book));
  }

  async findAll(): Promise<BookItem[]> {
    const books = await this.booksRepository.find();

    return books.map(BookItem.toBookItem);
  }

  async findOne(id: number): Promise<BookItem | null> {
    const book = await this.booksRepository.findOne({ where: { id } });

    return book ? BookItem.toBookItem(book) : null;
  }

  async update(
    id: number,
    updateBookDto: BookUpdateDto,
  ): Promise<BookItem | null> {
    await this.booksRepository.update(id, updateBookDto);
    const updatedBook = await this.booksRepository.findOne({ where: { id } });

    return updatedBook ? BookItem.toBookItem(updatedBook) : null;
  }

  async remove(id: number): Promise<void> {
    await this.booksRepository.delete(id);
  }

  async findAvailableBooks(): Promise<BookItem[]> {
    const books = await this.booksRepository.find({
      where: { available: true },
    });

    return books.map(BookItem.toBookItem);
  }
}
