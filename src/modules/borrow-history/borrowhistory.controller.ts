import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { BorrowHistoryService } from './borrowhistory.service';
import { BorrowHistoryDto } from './dto/borrow-history.dto';
import { BorrowBookDto } from './dto/borrow-book.dto';

@Controller('borrow-history')
export class BorrowHistoryController {
  constructor(private readonly borrowHistoryService: BorrowHistoryService) {}

  @Get()
  async findAll(): Promise<BorrowHistoryDto[]> {
    return BorrowHistoryDto.fromBorowHistories(
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

  @Put('return/:id')
  async returnBook(
    @Param('id') id: number,
  ): Promise<BorrowHistoryDto> {
    return BorrowHistoryDto.fromBorrowHistory(
      await this.borrowHistoryService.returnBook(id),
    );
  }
}
