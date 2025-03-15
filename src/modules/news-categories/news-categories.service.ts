import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { NewsCategory } from './entities/news-category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';

@Injectable()
export class NewsCategoriesService {
  constructor(
    @InjectRepository(NewsCategory)
    private readonly newsCategoryRepository: Repository<NewsCategory>,
  ) {}

  async create(
    createCategoryDto: CreateCategoryDto,
  ): Promise<CreateCategoryDto> {
    await this.isNewsCategoryExist(createCategoryDto.name);

    const newsCatagory = this.newsCategoryRepository.create(createCategoryDto);
    return this.newsCategoryRepository.save(createCategoryDto);
  }
  0;

  async findAll(): Promise<NewsCategory[]> {
    return this.newsCategoryRepository.find();
  }

  async findOne(id: string): Promise<NewsCategory> {
    const newsCategory = await this.newsCategoryRepository.findOne({
      where: { id },
    });
    if (!newsCategory) {
      throw new NotFoundException();
    }
    return newsCategory;
  }

  async updateNewsCategory(
    id: string,
    newsCatagory: NewsCategory,
  ): Promise<NewsCategory> {
    await this.findOne(id);

    await this.isNewsCategoryExist(newsCatagory.name, id);

    await this.newsCategoryRepository.update({ id: id }, newsCatagory);

    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.newsCategoryRepository.delete(id);
  }

  private async isNewsCategoryExist(name: string, id?: string): Promise<void> {
    const newsCategory = await this.newsCategoryRepository.findOneBy({
      name: ILike(name),
    });

    if (newsCategory && newsCategory.id !== id) {
      throw new ConflictException('News Category already exists');
    }
  }
}
