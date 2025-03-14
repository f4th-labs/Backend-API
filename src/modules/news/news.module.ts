import { Module } from '@nestjs/common';
import { NewsService } from './news.service';
import { NewsController } from './news.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { News } from './entities/news.entity';
import { MinioModule } from '../minio/minio.module';
import { UsersModule } from '../users/users.module';
import { NewsCategoriesModule } from '../news-categories/news-categories.module';

@Module({
  imports: [TypeOrmModule.forFeature([News]), MinioModule, UsersModule, NewsCategoriesModule],
  controllers: [NewsController],
  providers: [NewsService],
  exports: [NewsService],
})
export class NewsModule {}
