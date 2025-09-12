import { UserModule } from './modules/user/user.module';
import { UserService } from './modules/user/user.service';
import { UserController } from './modules/user/user.controller';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    UserModule,
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.TZ_DB_HOST || 'localhost',
      port: 5432,
      username: process.env.TZ_DB_USERNAME || 'postgres',
      password: process.env.TZ_DB_PASSWORD || '123456',
      database: process.env.TZ_DB_DATABASE,
      autoLoadEntities: true,
      synchronize: true, // Chỉ dùng ở môi trường dev
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
