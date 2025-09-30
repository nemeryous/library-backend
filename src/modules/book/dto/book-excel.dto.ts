import { ApiProperty } from '@nestjs/swagger';

export class BookExcelDto {
  @ApiProperty()
  readonly file: Express.Multer.File;
}
