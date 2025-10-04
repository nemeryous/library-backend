import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { SharedModule } from '../../shared/shared.module';

@Module({
  imports: [
    SharedModule
  ],
  providers: [EmailService],
  exports: [EmailService]
})
export class EmailModule { }
