import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { NewsCategory } from '@/modules/news-categories/entities/news-category.entity';
import { User } from '@/modules/users/entities/user.entity';

@Entity({ name: 'news' })
export class News {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  content: string;

  @ManyToOne(() => NewsCategory, (category) => category.name)
  @JoinColumn()
  category: string;

  @ManyToOne(() => User, (author) => author.news)
  @JoinColumn()
  author: string;

  @Column({
    type: 'timestamp',
    unique: true,
  })
  createdDate: Date;
}
