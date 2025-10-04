import { AuthModule } from './modules/auth/auth.module';
import { AuthService } from './modules/auth/auth.service';
import { AuthController } from './modules/auth/auth.controller';
import { KeycloakModule } from './modules/keycloak/keycloak.module';
import { KeycloakService } from './modules/keycloak/keycloak.service';
import { BorrowHistoryModule } from './modules/borrow-history/borrow-history.module';
import { UserModule } from './modules/user/user.module';
import { SharedModule } from './shared/shared.module';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { BookModule } from './modules/book/book.module';
import {
  KeycloakConnectModule,
} from 'nest-keycloak-connect';
import { SchedulerModule } from './modules/scheduler/scheduler.module';
import { EmailModule } from './modules/email/email.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    SharedModule,
    AuthModule,
    KeycloakModule,
    BorrowHistoryModule,
    UserModule,
    BookModule,
    SchedulerModule,
    EmailModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      serveRoot: '/public',
    }),
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
  providers: [AppService],
})
export class AppModule { }
