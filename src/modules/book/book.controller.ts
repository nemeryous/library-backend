import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { BookService } from './book.service';
import { BookCreateDto } from './dto/book-create.dto';
import { BookUpdateDto } from './dto/book-update.dto';
import { BookItemDto } from './dto/book-item.dto';
import { BookDetailDto } from './dto/book-detail.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Books')
@Controller('books')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Get()
  async findAll(): Promise<BookItemDto[]> {
    return BookItemDto.fromBooks(await this.bookService.findAll());
  }

  @Get('available')
  async findAvailableBooks(
    @Query('name') name?: string,
  ): Promise<BookItemDto[]> {
    return BookItemDto.fromBooks(
      await this.bookService.findAvailableBooks(name),
    );
  }

  @Post()
  async create(@Body() bookCreateDto: BookCreateDto): Promise<BookItemDto> {
    return BookItemDto.fromBook(
      await this.bookService.create(BookCreateDto.toBookCreate(bookCreateDto)),
    );
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<BookDetailDto> {
    return BookDetailDto.fromBook(await this.bookService.findOne(id));
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() bookUpdateDto: BookUpdateDto,
  ): Promise<BookItemDto> {
    return BookItemDto.fromBook(
      await this.bookService.update(
        id,
        BookUpdateDto.toBookUpdate(bookUpdateDto),
      ),
    );
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    await this.bookService.remove(id);
  }
}
