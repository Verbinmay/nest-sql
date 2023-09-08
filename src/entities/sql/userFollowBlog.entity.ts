import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Blog } from './blog.entity';
import { User } from './user.entity';

@Entity()
@Index(['userId', 'blogId'], { unique: true })
export class UserFollowBlog {
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @Column()
  public userId: string;

  @Column()
  public blogId: string;

  @Column()
  public status: 'None' | 'Subscribed' | 'Unsubscribed';

  @CreateDateColumn({ type: 'timestamp' })
  public createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  public updatedAt!: Date;

  @ManyToOne(() => User, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  public user: User;

  @ManyToOne(() => Blog, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  public blog: Blog;

  getBlogsView() {
    return this.blog;
  }
}
