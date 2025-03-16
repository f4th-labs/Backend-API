import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { News } from './entities/news.entity';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import { MinioService } from '../minio/minio.service';
import { User } from '../users/entities/user.entity';
import { NewsCategoriesService } from '../news-categories/news-categories.service';

@Injectable()
export class NewsService {
  constructor(
    @InjectRepository(News)
    private readonly newsRepository: Repository<News>,
    private readonly minioService: MinioService,
    private readonly newsCategoriesService: NewsCategoriesService,
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

    const category = await this.newsCategoriesService.findOne(
      createNewsDto.categoryId,
    );
    console.log('category', category);

    const news = await this.newsRepository.create({
      ...createNewsDto,
      author,
      imageUrl,
    });

    news.category = category;

    console.log('news', news);

    return this.newsRepository.save(news);
  }

  async search(query: string): Promise<News[]> {
    if (!query) {
      return this.findAll();
    }

    return this.newsRepository
      .createQueryBuilder('news')
      .leftJoinAndSelect('news.author', 'author')
      .leftJoinAndSelect('news.category', 'category')
      .where('news.title ILIKE :query', { query: `%${query}%` })
      .orWhere('news.description ILIKE :query', { query: `%${query}%` })
      .orWhere('news.content ILIKE :query', { query: `%${query}%` })
      .orderBy('news.createdDate', 'DESC')
      .getMany();
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
      throw new NotFoundException(`News not found`);
    }
    return news;
  }

  async update(id: string, updateNewsDto: UpdateNewsDto): Promise<News> {
    const news = await this.newsRepository.findOne({
      where: { id },
      relations: ['author', 'category'],
    });

    if (!news) {
      throw new NotFoundException(`New not found`);
    }

    const category = await this.newsCategoriesService.findOne(
      updateNewsDto.categoryId,
    );

    news.category = category;

    const updatedNews = {
      ...news,
      ...updateNewsDto,
      author: news.author,
    };

    const result = await this.newsRepository.save(updatedNews);

    return result;
  }

  async remove(id: string): Promise<void> {
    const news = await this.newsRepository.findOne({ where: { id } });
    if (!news) {
      throw new NotFoundException(`News not found`);
    }

    const imageUrl = news.imageUrl;

    if (imageUrl) {
      const url = new URL(imageUrl);
      const urlPath = url.pathname;

      const encodedFileName = urlPath.split('/').pop() || '';
      const fileName = decodeURIComponent(encodedFileName.split('?')[0]);

      if (fileName) {
        await this.minioService.deleteFile(fileName);
      } else {
        throw new InternalServerErrorException(`File name error`);
      }
    }

    await this.newsRepository.delete(id);
  }
}
