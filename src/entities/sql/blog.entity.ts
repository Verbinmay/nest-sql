import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ViewBlogDto } from '../../blogger/dto/blog/view-blog.dto';
import { SAViewBlogDto } from '../../sa/dto/blog/sa-view-blog.dto';
import { getImageViewModelUtil } from '../../helpers/images.util';
import { Images } from './image.entity';
import { User } from './user.entity';
import { UserFollowBlog } from './userFollowBlog.entity';

@Entity()
export class Blog {
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @Column({ length: 15 })
  public name: string;

  @Column({ length: 500 })
  public description: string;

  @Column({ length: 100 })
  public websiteUrl: string;

  @ManyToOne(() => User, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  user: User;

  @CreateDateColumn({ type: 'timestamp' })
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;

  @Column({ type: 'boolean', default: false })
  public isMembership = false;

  @Column('boolean')
  public isBanned = false;

  @Column({ default: null, type: 'timestamp' })
  public banDate: Date | null = null;

  @DeleteDateColumn()
  deletedAt: Date;

  @OneToMany(() => Images, (images) => images.blog)
  images: Images[];

  @OneToMany(() => UserFollowBlog, (userFollowBlog) => userFollowBlog.blog)
  public followers: Array<UserFollowBlog>;
}

export async function getBlogViewModel(
  blog: Blog,
  userId = '',
): Promise<ViewBlogDto> {
  const result: any = {
    id: blog.id,
    name: blog.name,
    description: blog.description,
    websiteUrl: blog.websiteUrl,
    createdAt: blog.createdAt.toISOString(),
    isMembership: blog.isMembership,
    images: {
      main: [],
      wallpaper: null,
    },
    currentUserSubscriptionStatus: 'None',
    subscribersCount: 0,
  };

  if (blog.images) {
    const wallpaper = await getImageViewModelUtil(blog.images, 'wallpaper');
    if (wallpaper.length > 0) result.images.wallpaper = wallpaper[0];

    const main = await getImageViewModelUtil(blog.images, 'main');
    if (main.length > 0) result.images.main = main;
  }
  if (blog.followers) {
    const currentUserForm = blog.followers.find((uf) => uf.userId === userId);
    if (currentUserForm) {
      result.currentUserSubscriptionStatus = currentUserForm.status;
    }
    result.subscribersCount = blog.followers.filter(
      (a) => a.status === 'Subscribed',
    ).length;
  }

  return result;
}

export function SAgetViewModel(blog: Blog): SAViewBlogDto {
  const result = {
    id: blog.id,
    name: blog.name,
    description: blog.description,
    websiteUrl: blog.websiteUrl,
    createdAt: blog.createdAt.toISOString(),
    isMembership: blog.isMembership,
    blogOwnerInfo: {
      userId: blog.user.id,
      userLogin: blog.user.login,
    },
    banInfo: {
      isBanned: blog.isBanned,
      banDate: blog.banDate === null ? null : blog.banDate.toISOString(),
    },
  };
  return result;
}
