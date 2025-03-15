import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import * as path from 'path';

config();

const configService = new ConfigService();
const isProduction = configService.get<string>('NODE_ENV') === 'production';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: configService.get<string>('POSTGRES_HOST'),
  port: parseInt(configService.get<string>('POSTGRES_PORT') || '5432'),
  username: configService.get<string>('POSTGRES_USER'),
  password: configService.get<string>('POSTGRES_PASSWORD'),
  database: configService.get<string>('POSTGRES_DB'),
  synchronize: false,
  entities: [
    isProduction
      ? path.join(__dirname, '..', '**', '*.entity.js')
      : 'src/**/*.entity.ts',
  ],
  migrations: [
    isProduction
      ? path.join(__dirname, '..', 'database', 'migrations', '*.js')
      : 'src/database/migrations/*.ts',
  ],
  migrationsRun: false,
  logging: true,
});
