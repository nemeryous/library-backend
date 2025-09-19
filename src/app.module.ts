import { BorrowHistoryService } from './modules/borrow-history/borrowhistory.service';
import { BorrowHistoryModule } from './modules/borrow-history/borrowhistory.module';
import { BorrowHistoryController } from './modules/borrow-history/borrowhistory.controller';
import { UserModule } from './modules/user/user.module';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { BookModule } from './modules/book/book.module';

@Module({
  imports: [
    BorrowHistoryModule,
    UserModule,
    BookModule,
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.TZ_DB_HOST || 'localhost',
      port: 5432,
      username: process.env.TZ_DB_USERNAME || 'postgres',
      password: process.env.TZ_DB_PASSWORD || '123456',
      database: process.env.TZ_DB_DATABASE,
      autoLoadEntities: true,
      synchronize: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
