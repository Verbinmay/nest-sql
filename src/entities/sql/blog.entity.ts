import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ViewBlogDto } from '../../blogger/dto/blog/view-blog.dto';
import { SAViewBlogDto } from '../../sa/dto/blog/sa-view-blog.dto';
import { User } from './user.entity';

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
}

export function getBlogViewModel(blog: Blog): ViewBlogDto {
  const result = {
    id: blog.id,
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
