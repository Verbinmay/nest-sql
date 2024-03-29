import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { ViewPostDto } from '../../public/dto/post/view-post.dto';
import { getImageViewModelUtil } from '../../helpers/images.util';
import { Blog } from './blog.entity';
import { Images } from './image.entity';
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

  @ManyToOne(() => Blog, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  blog: Blog;

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

  @OneToMany(() => Images, (images) => images.post)
  images: Images[];
}

export async function getPostViewModel(
  post: Post,
  userId: string,
): Promise<ViewPostDto> {
  let status: 'None' | 'Like' | 'Dislike' = 'None';
  let likesCount = 0;
  let dislikeCount = 0;
  let newestLikes = [];
  if (post.likes.length !== 0) {
    const like = post.likes.find((m) => m.user.id === userId);
    if (like) status = like.status;

    likesCount = post.likes.filter(
      (m) => m.status === 'Like' && m.isBanned === false,
    ).length;

    dislikeCount = post.likes.filter(
      (m) => m.status === 'Dislike' && m.isBanned === false,
    ).length;

    newestLikes = post.likes
      .filter((m) => m.status === 'Like' && m.isBanned === false)
      .sort((a, b) => {
        const dateA = a.addedAt.getTime();
        const dateB = b.addedAt.getTime();
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
  const result: any = {
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
    images: {
      main: [],
    },
  };

  if (post.images) {
    // result.images = {};
    const main = await getImageViewModelUtil(post.images, 'post');

    result.images.main = main;
  }
  return result;
}
