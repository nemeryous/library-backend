import { ApiProperty } from '@nestjs/swagger';
import { UploadResult } from '../domain/upload-result';

export class UploadResultDto {
  @ApiProperty()
  status: 'success' | 'error';

  @ApiProperty()
  message: string;

  @ApiProperty()
  count?: number;

  static fromUploadResult(uploadResult: UploadResult): UploadResultDto {
    return {
      status: uploadResult.status,
      message: uploadResult.message,
      count: uploadResult.count,
    };
  }
}
