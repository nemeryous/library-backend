import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book } from './books.entity';
import { BooksCreateDto } from './dto/books.create.dto';
import { BooksUpdateDto } from './dto/books.update.dto';

@Injectable()
export class BooksService {
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

  async create(createBookDto: BooksCreateDto): Promise<Book> {
    const ean13 = await this.generateEAN13();
    const book = this.booksRepository.create({ ...createBookDto, ean13 });

    return this.booksRepository.save(book);
  }

  async findAll(): Promise<Book[]> {
    return this.booksRepository.find();
  }

  async findOne(id: number): Promise<Book | null> {
    return this.booksRepository.findOne({ where: { id } });
  }

  async update(
    id: number,
    updateBookDto: BooksUpdateDto,
  ): Promise<Book | null> {
    await this.booksRepository.update(id, updateBookDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.booksRepository.delete(id);
  }

  async findAvailableBooks(): Promise<Book[]> {
    return this.booksRepository.find({ where: { available: true } });
  }
}
