import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';


async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);
    const configService = app.get(ConfigService);
    app.use(cookieParser());

    await app.listen(process.env.PORT ?? 3000);
  } catch (error) {
    console.error('Error during app initialization:', error);
  }
}
bootstrap();