import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { BookService } from './book.service';
import { BookCreateDto } from './dto/book-create.dto';
import { BookUpdateDto } from './dto/book-update.dto';
import { BookItem } from './response/book-item';

@Controller('books')
export class BookController {
  constructor(private readonly booksService: BookService) {}

  @Get()
  async findAll(): Promise<BookItem[]> {
    return this.booksService.findAll();
  }

  @Get('available')
  async findAvailableBooks(): Promise<BookItem[]> {
    return this.booksService.findAvailableBooks();
  }

  @Post()
  async create(@Body() createBookDto: BookCreateDto): Promise<BookItem> {
    return this.booksService.create(createBookDto);
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<BookItem | null> {
    return this.booksService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() updateBookDto: BookUpdateDto,
  ): Promise<BookItem | null> {
    return this.booksService.update(id, updateBookDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    return this.booksService.remove(id);
  }
}
