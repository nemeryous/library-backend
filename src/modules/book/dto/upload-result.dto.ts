import { ApiProperty } from '@nestjs/swagger';
import { UploadResult } from '../domain/upload-result';

export class UploadResultDto {
  @ApiProperty()
  success: number;

  @ApiProperty()
  failed: number;

  @ApiProperty({ type: [String] })
  errors: string[];

  static fromUploadResult(uploadResult: UploadResult): UploadResultDto {
    return {
      success: uploadResult.success,
      failed: uploadResult.failed,
      errors: uploadResult.errors,
    };
  }
}
