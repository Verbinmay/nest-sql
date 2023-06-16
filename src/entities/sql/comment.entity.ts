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
  likes: Array<CommentLike>,
  posts: Array<Post>,
  userId: string,
): ViewCommentWithPostInfoDto {
  const post: Post = posts.find((post) => post.id === comment.post.id);
  let status: 'None' | 'Like' | 'Dislike' = 'None';
  let likesCount = 0;
  let dislikeCount = 0;
  if (likes.length !== 0) {
    const like = likes.find((m) => m.user.id === userId);
    if (like) status = like.status;

    likesCount = likes.filter(
      (m) =>
        m.status === 'Like' &&
        m.isBanned === false &&
        m.comment.id === comment.id,
    ).length;

    dislikeCount = likes.filter(
      (m) =>
        m.status === 'Dislike' &&
        m.isBanned === false &&
        m.comment.id === comment.id,
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
      id: post.id,
      title: post.title,
      blogId: post.blog.id,
      blogName: post.blog.name,
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
  likes: Array<CommentLike>,
  userId: string,
): ViewCommentDto {
  let status: 'None' | 'Like' | 'Dislike' = 'None';
  let likesCount = 0;
  let dislikeCount = 0;
  if (likes.length !== 0) {
    const like = likes.find((m) => m.user.id === userId);
    if (like) status = like.status;

    likesCount = likes.filter(
      (m) =>
        m.status === 'Like' &&
        m.isBanned === false &&
        m.comment.id === comment.id,
    ).length;

    dislikeCount = likes.filter(
      (m) =>
        m.status === 'Dislike' &&
        m.isBanned === false &&
        m.comment.id === comment.id,
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
