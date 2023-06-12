import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ViewBlogDto } from '../../blogger/dto/blog/view-blog.dto';
import { SAViewBlogDto } from '../../sa/dto/blog/sa-view-blog.dto';

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

  @Column('uuid')
  public userId: string;

  @Column('text')
  public userLogin: string;

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
}

export function getBlogViewModel(blog: Blog): ViewBlogDto {
  const result = {
    id: blog.id.toString(),
    name: blog.name,
    description: blog.description,
    websiteUrl: blog.websiteUrl,
    createdAt: blog.createdAt.toISOString(),
    isMembership: blog.isMembership,
  };
  return result;
}
export function SAgetViewModel(blog: Blog): SAViewBlogDto {
  const result = {
    id: blog.id.toString(),
    name: blog.name,
    description: blog.description,
    websiteUrl: blog.websiteUrl,
    createdAt: blog.createdAt.toISOString(),
    isMembership: blog.isMembership,
    blogOwnerInfo: {
      userId: blog.userId,
      userLogin: blog.userLogin,
    },
    banInfo: {
      isBanned: blog.isBanned,
      banDate: blog.banDate === null ? null : blog.banDate.toISOString(),
    },
  };
  return result;
}
