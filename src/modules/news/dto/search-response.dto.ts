import { ApiProperty } from '@nestjs/swagger';
import { News } from '../entities/news.entity';

export class SearchResponseDto {
  @ApiProperty({ type: [News] })
  results: News[];

  @ApiProperty({ description: 'Total count of matching records', example: 42 })
  total: number;
}
