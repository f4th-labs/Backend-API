import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UserRole } from '../../../shares/enums';
import { News } from '@/modules/news/entities/news.entity';

@Entity({
  name: 'users',
})
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column({
    nullable: true,
  })
  fullName: string;

  @Column({
    nullable: true,
  })
  lastName: string;

  @Column()
  password: string;

  @Column({
    enum: UserRole,
    nullable: true,
  })
  role: string;

  @OneToMany(() => News, (news) => news.author, {
    cascade: true,
    nullable: true,
  })
  news: News[];
}
