export class UploadResult {
  status: 'success' | 'error';

  message: string;

  count?: number;
}
