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
import { BookItemDto } from './dto/book-item.dto';
import { BookDetailDto } from './dto/book-detail.dto';

@Controller('books')
export class BookController {
  constructor(private readonly booksService: BookService) {}

  @Get()
  async findAll(): Promise<BookItemDto[]> {
    return BookItemDto.fromBooks(await this.booksService.findAll());
  }

  @Get('available')
  async findAvailableBooks(): Promise<BookItemDto[]> {
    return BookItemDto.fromBooks(await this.booksService.findAvailableBooks());
  }

  @Post()
  async create(@Body() bookCreateDto: BookCreateDto): Promise<BookItemDto> {
    return BookItemDto.fromBook(
      await this.booksService.create(BookCreateDto.toBookCreate(bookCreateDto)),
    );
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<BookDetailDto> {
    return BookDetailDto.fromBook(await this.booksService.findOne(id));
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() bookUpdateDto: BookUpdateDto,
  ): Promise<BookItemDto> {
    const updatedBook = await this.booksService.update(
      id,
      BookUpdateDto.toBookUpdate(bookUpdateDto),
    );

    return BookItemDto.fromBook(updatedBook);
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    await this.booksService.remove(id);
  }
}
