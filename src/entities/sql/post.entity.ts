import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  BeforeRemove,
} from 'typeorm';
import { ViewPostDto } from '../../public/dto/post/view-post.dto';
import { Blog } from './blog.entity';
import { Comment } from './comment.entity';
import { PostLike } from './post.like.entity';
import { User } from './user.entity';

@Entity()
export class Post {
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @Column()
  public title: string;

  @Column()
  public shortDescription: string;

  @Column()
  public content: string;

  // @Column('uuid')
  // public blogId: string;

  // @Column()
  // public blogName: string;

  @ManyToOne(() => Blog, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  blog: Blog;

  // @Column('uuid')
  // public userId: string;

  @ManyToOne(() => User, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  user: User;

  @Column({ type: 'boolean', default: false })
  public isBanned = false;

  @CreateDateColumn({ type: 'timestamp' })
  public createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  public updatedAt!: Date;

  @OneToMany(() => PostLike, (postLike) => postLike.post)
  likes: PostLike[];
}

export function getPostViewModel(
  post: Post,
  likes: Array<PostLike>,
  userId: string,
): ViewPostDto {
  let status: 'None' | 'Like' | 'Dislike' = 'None';
  let likesCount = 0;
  let dislikeCount = 0;
  let newestLikes = [];
  if (likes.length !== 0) {
    const like = likes.find((m) => m.user.id === userId);
    if (like) status = like.status;

    likesCount = likes.filter(
      (m) =>
        m.status === 'Like' && m.isBanned === false && m.post.id === post.id,
    ).length;

    dislikeCount = likes.filter(
      (m) =>
        m.status === 'Dislike' && m.isBanned === false && m.post.id === post.id,
    ).length;

    newestLikes = likes
      .filter(
        (m) =>
          m.status === 'Like' && m.isBanned === false && m.post.id === post.id,
      )
      .sort((a, b) => {
        const dateA = new Date(a.addedAt).getTime();
        const dateB = new Date(b.addedAt).getTime();
        return dateA - dateB;
      })
      .slice(-3)
      .map((a) => {
        return {
          addedAt: a.addedAt,
          userId: a.user.id,
          login: a.user.login,
        };
      })
      .reverse();
  }
  return {
    id: post.id,
    title: post.title,
    shortDescription: post.shortDescription,
    content: post.content,
    blogId: post.blog.id,
    blogName: post.blog.name,
    createdAt: post.createdAt.toISOString(),
    extendedLikesInfo: {
      likesCount: likesCount,
      dislikesCount: dislikeCount,
      myStatus: status,
      newestLikes: newestLikes,
    },
  };
}
