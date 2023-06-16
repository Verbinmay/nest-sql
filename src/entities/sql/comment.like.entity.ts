import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Comment } from './comment.entity';
import { User } from './user.entity';

export type statusLikeEnum = 'Like' | 'Dislike';

@Entity()
export class CommentLike {
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @CreateDateColumn({ type: 'timestamp' })
  public addedAt: Date;

  // @Column()
  // public login: string;

  // @Column('uuid')
  // public userId: string;
  @ManyToOne(() => User, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  user: User;

  // @Column('uuid')
  // public commentId: string;
  @ManyToOne(() => Comment, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  comment: Comment;

  @Column({ type: 'enum', enum: ['Like', 'Dislike'] })
  public status: statusLikeEnum;

  @Column({ type: 'boolean', default: false })
  public isBanned = false;
}
