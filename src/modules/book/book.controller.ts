import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { BookService } from './book.service';
import { BookCreateDto } from './dto/book-create.dto';
import { BookUpdateDto } from './dto/book-update.dto';
import { BookItemDto } from './dto/book-item.dto';
import { BookDetailDto } from './dto/book-detail.dto';
import { ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';
import { RequireAdmin } from 'src/guards/role-container';
import { UploadResultDto } from './dto/upload-result.dto';

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

  @Post('upload-excel')
  @UseInterceptors(FileInterceptor('file'))
  @UseGuards(AuthGuard('jwt'))
  @RequireAdmin()
  async uploadExcel(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<UploadResultDto> {
    return UploadResultDto.fromUploadResult(
      await this.bookService.uploadBooks(file),
    );
  }
}
