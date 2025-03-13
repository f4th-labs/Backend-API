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

  @Column({ nullable: true })
  imageUrl: string;

  @ManyToOne(() => NewsCategory, (category) => category.name)
  @JoinColumn()
  category: string;

  @ManyToOne(() => User, (user) => user.news)
  @JoinColumn()
  author: User;

  @CreateDateColumn({
    type: 'timestamp',
  })
  createdDate: Date;
}
