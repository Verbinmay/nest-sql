import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  Column,
  ManyToOne,
} from 'typeorm';
import { Post } from './post.entity';
import { User } from './user.entity';

export type statusLikeEnum = 'Like' | 'Dislike';

@Entity()
export class PostLike {
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @CreateDateColumn({ type: 'timestamp' })
  public addedAt: Date;

  // @Column()
  // public login: string;

  // @Column('uuid')
  // public userId: string;

  // @Column('uuid')
  // public postId: string;

  @Column({ type: 'enum', enum: ['Like', 'Dislike'] })
  public status: statusLikeEnum;

  @Column({ type: 'boolean', default: false })
  public isBanned = false;

  @ManyToOne(() => Post, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  post: Post;

  @ManyToOne(() => User, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  user: User;
}
