import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateNewsDto {
  @ApiProperty({
    example: 'Title',
    description: 'The title of the news',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({
    example: 'Description',
    description: 'The description of the news',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({
    example: 'Content',
    description: 'The content of the news',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  content: string;

  @ApiProperty({
    example: 'Technology',
    description: 'The category of the news',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  categoryId: string;

  @ApiProperty({
    example: 'https://example.com/image.jpg',
    description: 'The image URL of the news',
    required: false,
  })
  @IsOptional()
  @IsString()
  imageUrl?: string;
}
