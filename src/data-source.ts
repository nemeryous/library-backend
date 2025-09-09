import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.TZ_DB_HOST || 'localhost',
  port: 5432,
  username: process.env.TZ_DB_USERNAME || 'postgres',
  password: process.env.TZ_DB_PASSWORD || '123456',
  database: process.env.TZ_DB_DATABASE,
  entities: ['src/**/*.entity.ts'],
  migrations: ['src/migrations/*.ts'],
  synchronize: false,
});
