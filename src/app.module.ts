import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NewsCategoriesModule, NewsModule, UsersModule } from './modules';
import { validate } from './config/config';
import { AuthModule } from './modules/auth/auth.module';
import { MinioModule } from './modules/minio/minio.module';
import { MinioController } from './modules/minio/minio.controller';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('POSTGRES_HOST'),
        port: configService.get<number>('POSTGRES_PORT'),
        username: configService.get<string>('POSTGRES_USER'),
        password: configService.get<string>('POSTGRES_PASSWORD'),
        database: configService.get<string>('POSTGRES_DB'),
        synchronize: configService.get<boolean>('isDevelopment'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        autoLoadEntities: true,
        logging: configService.get<boolean>('isDevelopment'),
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    NewsModule,
    NewsCategoriesModule,
    UsersModule,
    MinioModule,
  ],
  controllers: [MinioController],
})
export class AppModule {}
