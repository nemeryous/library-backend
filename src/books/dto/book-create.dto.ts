import { ApiProperty } from '@nestjs/swagger';

export class BookCreateDto {
  @ApiProperty()
  name: string;
}
