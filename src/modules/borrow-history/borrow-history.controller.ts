import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import type { Response } from 'express';
import { BorrowHistoryService } from './borrow-history.service';
import { BorrowHistoryDto } from './dto/borrow-history.dto';
import { BorrowBookDto } from './dto/borrow-book.dto';
import { BookItemDto } from '../book/dto/book-item.dto';
import { BookDetailDto } from '../book/dto/book-detail.dto';
import { BookBorrowHistoryDto } from './dto/book-borrow-history.dto';
import { RequireLoggedIn } from 'src/guards/role-container';
import { AuthGuard } from '@nestjs/passport';
import { AuthUser } from 'src/decorator/auth-user.decorator';
import type { IAuthUser } from 'src/decorator/auth-user.decorator';

@Controller('borrows')
export class BorrowHistoryController {
  constructor(private readonly borrowHistoryService: BorrowHistoryService) { }

  @Get()
  async findAll(): Promise<BorrowHistoryDto[]> {
    return BorrowHistoryDto.fromBorrowHistories(
      await this.borrowHistoryService.findAll(),
    );
  }

  @Post()
  async borrowBook(
    @Body() borrowBookDto: BorrowBookDto,
  ): Promise<BorrowHistoryDto> {
    return BorrowHistoryDto.fromBorrowHistory(
      await this.borrowHistoryService.create(
        BorrowBookDto.toBorrowBook(borrowBookDto),
      ),
    );
  }

  @Get('by-code/:code')
  async getBorrowHistoryByCodeEan13(
    @Param('code') code: string,
  ): Promise<BookBorrowHistoryDto> {
    return BookBorrowHistoryDto.fromBookBorrowHistory(
      await this.borrowHistoryService.getBorrowHistoryByCodeEan13(code),
    );
  }

  @Get('by-user/:userId')
  async getBorrowedBooksByUser(
    @Param('userId') userId: number,
  ): Promise<BookItemDto[]> {
    return BookDetailDto.fromBooks(
      await this.borrowHistoryService.getBorrowedBooksByUser(userId),
    );
  }

  @Delete('return/:id')
  async returnBook(@Param('id') id: number): Promise<BorrowHistoryDto> {
    return BorrowHistoryDto.fromBorrowHistory(
      await this.borrowHistoryService.remove(id),
    );
  }

  @Get('histories/export')
  @RequireLoggedIn()
  async exportMyHistory(
    @AuthUser() user: IAuthUser,
    @Res() res: Response,
  ): Promise<void> {
    const buffer = await this.borrowHistoryService.exportByUser(user.id);

    res.set({
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': 'attachment; filename="my-borrow-history.xlsx"',
      'Content-Length': buffer.length.toString(),
    });

    res.send(buffer);
  }
}
