import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { BorrowHistoryService } from './borrowhistory.service';
import { BorrowHistoryDto } from './dto/borrow-history.dto';
import { BorrowBookDto } from './dto/borrow-book.dto';
import { BookItemDto } from '../book/dto/book-item.dto';
import { BorrowHistory } from './domain/borrow-history';

@Controller('borrow-history')
export class BorrowHistoryController {
  constructor(private readonly borrowHistoryService: BorrowHistoryService) {}

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

  @Get('get-book-by-code/:code')
  async getBorrowHistoryByCodeEan13(
    @Param('code') code: string,
  ): Promise<{ available: boolean; borrowHistories: BorrowHistoryDto[] }> {
    const { available, borrowHistories } =
      await this.borrowHistoryService.getBorrowHistoryByCodeEan13(code);

    return {
      available,
      borrowHistories: BorrowHistoryDto.fromBorrowHistories(borrowHistories),
    };
  }

  @Delete('return/:id')
  async returnBook(@Param('id') id: number): Promise<BorrowHistoryDto> {
    return BorrowHistoryDto.fromBorrowHistory(
      await this.borrowHistoryService.remove(id),
    );
  }
}
