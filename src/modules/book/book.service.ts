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
    try {
      const jsonData = this.parseExcelFile(file);

      if (jsonData.length === 0) {
        throw new BadRequestException('Excel file is empty');
      }

      const bookEntities = await this.createBookEntitiesFromRows(jsonData);

      const savedBooks = await this.bookRepository.save(bookEntities);

      return {
        status: 'success',
        message: 'Books uploaded successfully',
        count: savedBooks.length,
      };
    } catch (error) {
      return {
        status: 'error',
        message: `Failed to upload books: ${error.message}`,
      };
    }
  }

  private async createBookEntitiesFromRows(rows: any[]): Promise<BookEntity[]> {
    return Promise.all(
      rows.map(async (row) => this.createBookEntityFromRow(row)),
    );
  }

  private async createBookEntityFromRow(row: any): Promise<BookEntity> {
    return this.bookRepository.create({
      name: this.sanitizeString(row.name),
      author: this.sanitizeString(row.author),
      publisher: this.sanitizeString(row.publisher),
      description: this.sanitizeString(row.description),
      category: this.sanitizeString(row.category),
      available: row.available === true || row.available === 'true',
      code: await this.generateUniqueEAN13(),
    });
  }

  private sanitizeString(value: string | null | undefined): string {
    return String(value || '').trim();
  }

  private parseExcelFile(file: Express.Multer.File): BookCreate[] {
    if (!file) throw new BadRequestException('No file uploaded');

    const workbook = XLSX.read(file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    return XLSX.utils.sheet_to_json(worksheet) as BookCreate[];
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
