import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import * as path from 'path';

config();

const configService = new ConfigService();
const isProduction = configService.get < string > 'NODE_ENV' === 'production';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: configService.get('POSTGRES_HOST') || 'localhost',
  port: parseInt(configService.get('POSTGRES_PORT') || '5432'),
  username: configService.get('POSTGRES_USER') || 'postgres',
  password: configService.get('POSTGRES_PASSWORD') || 'p@ssword',
  database: configService.get('POSTGRES_DB') || 'mydb',
  synchronize: false,
  entities: [
    isProduction
      ? path.join(__dirname, '..', '**', '*.entity.js')
      : path.join(__dirname, '..', '**', '*.entity.ts'),
  ],
  migrations: [
    isProduction
      ? path.join(__dirname, '..', 'database', 'migrations', '*.js')
      : path.join(__dirname, '..', 'database', 'migrations', '*.ts'),
  ],
  migrationsTableName: 'migrations',
  logging: !isProduction,
});
