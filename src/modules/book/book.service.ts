import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { BookEntity } from './entity/book.entity';
import { BookCreate } from './domain/book-create';
import { Book } from './domain/book';
import { BookUpdate } from './domain/book-update';
import { generateEAN13 } from 'src/utils/helpers';
import { UploadResult } from './domain/upload-result';
import * as XLSX from 'xlsx';

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
    const jsonData = this.parseExcelFile(file);

    if (jsonData.length === 0) {
      throw new BadRequestException('Excel file is empty');
    }

    const validationResult = this.validateBookData(jsonData);

    const creationResult = await this.createBooksInParallel(
      validationResult.validBooks,
    );

    return {
      success: creationResult.success,
      failed: validationResult.invalidCount + creationResult.failed,
      errors: [...validationResult.errors, ...creationResult.errors],
    };
  }

  private parseExcelFile(file: Express.Multer.File): BookCreate[] {
    if (!file) throw new BadRequestException('No file uploaded');

    const workbook = XLSX.read(file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    return XLSX.utils.sheet_to_json(worksheet) as BookCreate[];
  }

  private async createBooksInParallel(
    validBooks: Array<{ index: number; data: BookCreate }>,
  ): Promise<{ success: number; failed: number; errors: string[] }> {
    if (validBooks.length === 0) {
      return { success: 0, failed: 0, errors: [] };
    }

    const promises = validBooks.map(async ({ index, data }) => {
      try {
        await this.create(data);

        return { success: true, index, error: null };
      } catch (error) {
        return {
          success: false,
          index,
          error: `Row ${index}: ${error.message}`,
        };
      }
    });

    const results = await Promise.allSettled(promises);

    const { success, failed, errors } = results.reduce(
      (acc, result) => {
        if (result.status === 'fulfilled') {
          if (result.value.success) {
            acc.success++;
          } else {
            acc.failed++;

            if (result.value.error) {
              acc.errors.push(result.value.error);
            }
          }

        } else {
          acc.failed++;
          acc.errors.push(`Unexpected error: ${result.reason}`);
        }

        return acc;
      },
      { success: 0, failed: 0, errors: [] as string[] },
    );

    return { success, failed, errors };
  }

  private validateBookData(jsonData: any[]): {
    validBooks: Array<{ index: number; data: BookCreate }>;
    invalidCount: number;
    errors: string[];
  } {
    const validBooks: Array<{ index: number; data: BookCreate }> = [];
    const errors: string[] = [];
    let invalidCount = 0;

    jsonData.forEach((row, index) => {
      const rowNumber = index + 2;

      const missingFields = this.getMissingFields(row);

      if (missingFields.length > 0) {
        invalidCount++;
        errors.push(
          `Row ${rowNumber}: Missing required fields: ${missingFields.join(', ')}`,
        );
        return;
      }

      validBooks.push({
        index: rowNumber,
        data: this.mapRowToBookCreate(row),
      });
    });

    return { validBooks, invalidCount, errors };
  }

  private mapRowToBookCreate(row: any): BookCreate {
    let available = true;
    if (row.available !== undefined) {
      const availableValue = String(row.available).toLowerCase();
      available = ['true'].includes(availableValue);
    }

    return {
      name: String(row.name).trim(),
      author: String(row.author).trim(),
      publisher: String(row.publisher).trim(),
      description: String(row.description).trim(),
      category: String(row.category).trim(),
      available,
    };
  }

  private getMissingFields(row: any): string[] {
    const requiredFields = [
      'name',
      'author',
      'publisher',
      'description',
      'category',
    ];
    
    return requiredFields.filter((field) => !row[field]?.toString().trim());
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
