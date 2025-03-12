import {
  Column,
  CreateDateColumn,
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
  description: string;

  @Column()
  content: string;

  @ManyToOne(() => NewsCategory, (category) => category.name, {
    nullable: true,
  })
  @JoinColumn()
  category: string;

  @ManyToOne(() => User, (author) => author.news, { nullable: true })
  @JoinColumn()
  author: string;

  @CreateDateColumn({
    type: 'timestamp',
  })
  createdDate: Date;
}
