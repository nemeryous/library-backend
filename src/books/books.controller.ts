import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { BooksService } from './books.service';
import { BooksCreateDto } from './dto/books.create.dto';
import { BooksUpdateDto } from './dto/books.update.dto';

@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Get()
  async findAll() {
    return this.booksService.findAll();
  }

  @Get('available-books')
  async findAvailableBooks() {
    return this.booksService.findAvailableBooks();
  }

  @Post()
  async create(@Body() createBookDto: BooksCreateDto) {
    return this.booksService.create(createBookDto);
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.booksService.findOne(id);
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() updateBookDto: BooksUpdateDto) {
    return this.booksService.update(id, updateBookDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    return this.booksService.remove(id);
  }

  
}
