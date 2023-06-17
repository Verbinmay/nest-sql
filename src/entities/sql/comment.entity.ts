import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { ViewCommentWithPostInfoDto } from '../../blogger/dto/comment/view-comment-with-post-info.dto';
import { ViewCommentDto } from '../../public/dto/comment/view-comment.dto';
import { CommentLike } from './comment.like.entity';
import { Post } from './post.entity';
import { User } from './user.entity';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @Column()
  public content: string;

  // @Column('uuid')
  // userId: string;

  // @Column()
  // userLogin: string;
  @ManyToOne(() => User, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  user: User;

  // @Column('uuid')
  // public postId: string;
  @ManyToOne(() => Post, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  post: Post;

  @CreateDateColumn({ type: 'timestamp' })
  public createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  public updatedAt: Date;

  @Column({ type: 'boolean', default: false })
  public isBanned = false;

  @OneToMany(() => CommentLike, (commentLike) => commentLike.comment)
  likes: CommentLike[];
}

export function getCommentWithPostInfoViewModel(
  comment: Comment,
  userId: string,
): ViewCommentWithPostInfoDto {
  let status: 'None' | 'Like' | 'Dislike' = 'None';
  let likesCount = 0;
  let dislikeCount = 0;
  if (comment.likes.length !== 0) {
    const like = comment.likes.find((m) => m.user.id === userId);
    if (like) status = like.status;

    likesCount = comment.likes.filter(
      (m) => m.status === 'Like' && m.isBanned === false,
    ).length;

    dislikeCount = comment.likes.filter(
      (m) => m.status === 'Dislike' && m.isBanned === false,
    ).length;
  }
  return {
    id: comment.id,
    content: comment.content,
    commentatorInfo: {
      userId: comment.user.id,
      userLogin: comment.user.login,
    },
    createdAt: comment.createdAt.toISOString(),
    postInfo: {
      id: comment.post.id,
      title: comment.post.title,
      blogId: comment.post.blog.id,
      blogName: comment.post.blog.name,
    },
    likesInfo: {
      likesCount: likesCount,
      dislikesCount: dislikeCount,
      myStatus: status,
    },
  };
}

export function getCommentViewModel(
  comment: Comment,
  userId: string,
): ViewCommentDto {
  let status: 'None' | 'Like' | 'Dislike' = 'None';
  let likesCount = 0;
  let dislikeCount = 0;
  if (comment.likes.length !== 0) {
    const like = comment.likes.find((m) => m.user.id === userId);
    if (like) status = like.status;

    likesCount = comment.likes.filter(
      (m) => m.status === 'Like' && m.isBanned === false,
    ).length;

    dislikeCount = comment.likes.filter(
      (m) => m.status === 'Dislike' && m.isBanned === false,
    ).length;
  }
  return {
    id: comment.id,
    content: comment.content,
    commentatorInfo: {
      userId: comment.user.id,
      userLogin: comment.user.login,
    },
    createdAt: comment.createdAt.toISOString(),
    likesInfo: {
      likesCount: likesCount,
      dislikesCount: dislikeCount,
      myStatus: status,
    },
  };
}
