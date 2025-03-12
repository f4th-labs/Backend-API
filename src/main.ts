import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';
import { config } from 'dotenv';

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);
    const configService = app.get(ConfigService);
    app.use(cookieParser());

    console.log(configService.get<string>('MINIO_ACCESS_KEY'));
    console.log(configService.get<string>('MINIO_SECRET_KEY'));

    await app.listen(configService.get<number>('PORT') || 3000);
  } catch (error) {
    console.error('Error during app initialization:', error);
  }
}
bootstrap();
