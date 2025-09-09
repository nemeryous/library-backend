import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  NotFoundException,
} from '@nestjs/common';
import { BookService } from './book.service';
import { BookCreateDto } from './dto/book-create.dto';
import { BookUpdateDto } from './dto/book-update.dto';
import { BookItem } from './response/book-item';
import { BookDetail } from './response/book-detail';

@Controller('books')
export class BookController {
  constructor(private readonly booksService: BookService) { }

  @Get()
  async findAll(): Promise<BookItem[]> {
    return (await this.booksService.findAll()).map(BookItem.toBookItem);
  }

  @Get('available')
  async findAvailableBooks(): Promise<BookItem[]> {
    return (await this.booksService.findAvailableBooks()).map(
      BookItem.toBookItem,
    );
  }

  @Post()
  async create(@Body() bookCreateDto: BookCreateDto): Promise<BookItem> {
    return BookItem.toBookItem(await this.booksService.create(bookCreateDto));
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<BookDetail> {
    const book = await this.booksService.findOne(id);

    return BookDetail.toBookDetails(book);
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() bookUpdateDto: BookUpdateDto,
  ): Promise<BookItem> {
    const updatedBook = await this.booksService.update(id, bookUpdateDto);

    return BookItem.toBookItem(updatedBook);
  }
  q;
  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    const book = await this.booksService.findOne(id);

    return this.booksService.remove(id);
  }
}
