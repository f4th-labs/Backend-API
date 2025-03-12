import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { NewsService } from './news.service';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';

@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @Post('post')
  async create(@Body() createNewsDto: CreateNewsDto) {
    return this.newsService.create(createNewsDto);
  }

  @Get('posts')
  async findAll() {
    return this.newsService.findAll();
  }

  @Get('post/:id')
  async findOne(@Param('id') id: string) {
    return this.newsService.findOne(id);
  }

  @Patch('post/:id')
  async update(@Param('id') id: string, @Body() updateNewsDto: UpdateNewsDto) {
    return this.newsService.update(id, updateNewsDto);
  }

  @Delete('post/:id')
  async remove(@Param('id') id: string) {
    return this.newsService.remove(id);
  }
}
