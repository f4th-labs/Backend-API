import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { News } from './entities/news.entity';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import { MinioService } from '../minio/minio.service';
import { User } from '../users/entities/user.entity';

@Injectable()
export class NewsService {
  constructor(
    @InjectRepository(News)
    private readonly newsRepository: Repository<News>,
    private readonly minioService: MinioService,
  ) {}

  async create(
    createNewsDto: CreateNewsDto,
    author: User,
    file?: Express.Multer.File,
  ): Promise<News> {
    let imageUrl: string | undefined;

    if (file) {
      await this.minioService.createBucketIfNotExists();
      const fileName = await this.minioService.uploadFile(file);
      imageUrl = await this.minioService.getFileUrl(fileName);
    }

    const news = await this.newsRepository.create({
      ...createNewsDto,
      author,
      imageUrl,
    });

    return this.newsRepository.save(news);
  }

  async findAll(): Promise<News[]> {
    return await this.newsRepository.find({
      relations: ['author', 'category'],
    });
  }

  async findOne(id: string): Promise<News> {
    const news = await this.newsRepository.findOne({
      where: { id },
      relations: ['author', 'category'],
    });
    if (!news) {
      throw new NotFoundException(`News with id ${id} not found`);
    }
    return news;
  }

  async update(id: string, updateNewsDto: UpdateNewsDto): Promise<News> {
    const news = await this.newsRepository.findOne({ where: { id } });
    if (!news) {
      throw new NotFoundException(`News not found`);
    }

    await this.newsRepository.update(id, updateNewsDto);
    return this.newsRepository.save(news);
  }

  async remove(id: string): Promise<void> {
    const news = await this.newsRepository.findOne({ where: { id } });
    if (!news) {
      throw new NotFoundException(`News with id ${id} not found`);
    }
    await this.newsRepository.delete(id);
  }
}
