import { News } from '@/modules/news/entities/news.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class NewsCategory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @OneToMany(() => News, (news) => news.category, { cascade: true })
  news: News[];
}
