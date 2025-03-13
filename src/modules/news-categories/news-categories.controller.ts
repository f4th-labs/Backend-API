import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { NewsCategoriesService } from './news-categories.service';
import { NewsCategory } from './entities/news-category.entity';

@Controller('news-categories')
export class NewsCategoriesController {
  constructor(private readonly newsCategoriesService: NewsCategoriesService) {}

  @Post()
  async create(@Body() newsCategory: NewsCategory) {
    return this.newsCategoriesService.create(newsCategory);
  }
  
  @Get()
  async findAll() {
    return this.newsCategoriesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.newsCategoriesService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateNewsCategory: NewsCategory,
  ) {
    return this.newsCategoriesService.updateNewsCategory(
      id,
      updateNewsCategory,
    );
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.newsCategoriesService.remove(id);
  }
}
