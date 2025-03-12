import { PartialType } from '@nestjs/mapped-types';
import { CreateNewsCategoryDto } from './create-news-category.dto';

export class UpdateNewsCategoryDto extends PartialType(CreateNewsCategoryDto) {}
