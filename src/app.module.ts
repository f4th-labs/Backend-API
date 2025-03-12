import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NewsCategoriesModule, NewsModule, UsersModule } from './modules';
import { configuration } from './config/config';
import { AuthModule } from './modules/auth/auth.module';
import { FileUploadModule } from './file-upload/file-upload.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '/.env',
      load: [configuration],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('database.host'),
        port: configService.get<number>('database.port'),
        username: configService.get<string>('database.username'),
        password: configService.get<string>('database.password'),
        database: configService.get<string>('database.db'),
        synchronize: configService.get<boolean>('isDevelopment'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        logging: configService.get<boolean>('isDevelopment'),
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    NewsModule,
    NewsCategoriesModule,
    UsersModule,
    FileUploadModule,
  ],
})
export class AppModule {}
