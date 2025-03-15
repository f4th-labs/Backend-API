import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { NewsCategoriesService } from './news-categories.service';
import { NewsCategory } from './entities/news-category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { JwtAuthGuard, RolesGuard } from '@/common/guards';
import { Roles } from '@/common/decorators';
import { UserRole } from '@/shares/enums';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('news-categories')
@Controller('news-categories')
export class NewsCategoriesController {
  constructor(private readonly newsCategoriesService: NewsCategoriesService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Post()
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.newsCategoriesService.create(createCategoryDto);
  }

  @Get()
  async findAll() {
    return this.newsCategoriesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.newsCategoriesService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
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

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.newsCategoriesService.remove(id);
  }
}
