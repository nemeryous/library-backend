import { BorrowHistoryModule } from './modules/borrow-history/borrowhistory.module';
import { UserModule } from './modules/user/user.module';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { BookModule } from './modules/book/book.module';
import {
  AuthGuard,
  KeycloakConnectModule,
  ResourceGuard,
  RoleGuard,
} from 'nest-keycloak-connect';
import { APP_GUARD } from '@nestjs/core';

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
    KeycloakConnectModule.register({
      authServerUrl: process.env.AUTH_SERVER_URL || 'http://localhost:8080',
      realm: process.env.AUTH_REALM,
      clientId: process.env.AUTH_CLIENT_ID,
      secret: process.env.AUTH_CLIENT_SECRET || '',
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: ResourceGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RoleGuard,
    },
  ],
})
export class AppModule {}
