import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { News } from './entities/news.entity';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';

@Injectable()
export class NewsService {
  constructor(
    @InjectRepository(News)
    private readonly newsRepository: Repository<News>,
  ) {}

  async create(createNewsDto: CreateNewsDto): Promise<News> {
    const news = this.newsRepository.create(createNewsDto);
    return this.newsRepository.save(news);
  }

  async findAll(): Promise<News[]> {
    return this.newsRepository.find();
  }

  async findOne(id: string): Promise<News> {
    const news = await this.newsRepository.findOne({ where: { id } });
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
