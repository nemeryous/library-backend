import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Like, Repository } from 'typeorm';
import { BookEntity } from './entity/book.entity';
import { BookCreate } from './domain/book-create';
import { Book } from './domain/book';
import { BookUpdate } from './domain/book-update';
import { generateEAN13 } from 'src/utils/helpers';
import { UploadResult } from './domain/upload-result';
import * as XLSX from 'xlsx';
import { BookExcelRowDto } from './dto/book-excel-row.dto';

@Injectable()
export class BookService {
  constructor(
    @InjectRepository(BookEntity)
    private readonly bookRepository: Repository<BookEntity>,
  ) {}

  async create(bookCreate: BookCreate): Promise<Book> {
    return Book.fromEntity(
      await this.bookRepository.save(
        this.bookRepository.create({
          ...BookCreate.toEntity(bookCreate),
          code: await this.generateUniqueEAN13(),
        }),
      ),
    );
  }

  async findAll(): Promise<Book[]> {
    return Book.fromEntities(await this.bookRepository.find());
  }

  async findOne(id: number): Promise<Book> {
    return Book.fromEntity(await this.findOneOrThrow(id));
  }

  async update(id: number, bookUpdate: BookUpdate): Promise<Book> {
    return Book.fromEntity(
      await this.bookRepository.save({
        ...(await this.findOneOrThrow(id)),
        ...BookUpdate.toEntity(bookUpdate),
      }),
    );
  }

  async remove(id: number): Promise<void> {
    await this.bookRepository.remove(await this.findOneOrThrow(id));
  }

  async findAvailableBooks(searchName?: string): Promise<Book[]> {
    return Book.fromEntities(
      await this.bookRepository.findBy({
        available: true,
        ...(searchName && {
          name: ILike(`%${searchName}%`),
        }),
      }),
    );
  }

  async uploadBooks(file: Express.Multer.File): Promise<UploadResult> {
    if (!file) throw new BadRequestException('No file uploaded');

    const workbook = XLSX.read(file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    const jsonData = XLSX.utils.sheet_to_json(worksheet) as BookCreate[];

    if (jsonData.length === 0) throw new BadRequestException('Excel file is empty');

    let success = 0;
    let failed = 0;
    const errors: string[] = [];

    for (let i = 0; i < jsonData.length; i++) {
      try {
        const row = jsonData[i];

        if (
          !row.name ||
          !row.author ||
          !row.publisher ||
          !row.description ||
          !row.category
        ) {
          failed++;
          errors.push(`Row ${i + 2}: Missing required fields`);
          continue;
        }

        await this.create({
          ...row,
        });

        success++;
      } catch (error) {
        failed++;
        errors.push(`Row ${i + 2}: ${error.message}`);
      }
    }

    return { success, failed, errors };
  }

  private async generateUniqueEAN13(): Promise<string> {
    const code = generateEAN13();
    const existing = await this.bookRepository.findOneBy({ code });

    return existing ? this.generateUniqueEAN13() : code;
  }

  private async findOneOrThrow(id: number): Promise<BookEntity> {
    const book = await this.bookRepository.findOneBy({ id });

    if (!book) {
      throw new NotFoundException(`Book with id ${id} not found`);
    }

    return book;
  }
}
