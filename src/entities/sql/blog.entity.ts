import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CreateBlogDto } from '../../blogger/dto/blog/create-blog.dto';
import { ViewBlogDto } from '../../blogger/dto/blog/view-blog.dto';
import { BanedUsers } from './blogsBannedUsers.entity';

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

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;

  @Column({ type: 'boolean', default: false })
  public isMembership = false;

  @Column('boolean')
  public isBanned = false;

  @Column({ default: null })
  public banDate: Date | null = null;

  // SAgetViewModel(): SAViewBlogDto {
  //   const result = {
  //     id: this.id.toString(),
  //     name: this.name,
  //     description: this.description,
  //     websiteUrl: this.websiteUrl,
  //     createdAt: this.createdAt.toISOString(),
  //     isMembership: this.isMembership,
  //     blogOwnerInfo: {
  //       userId: this.userId,
  //       userLogin: this.userLogin,
  //     },
  //     banInfo: {
  //       isBanned: this.isBanned,
  //       banDate: this.banDate.toISOString(),
  //     },
  //   };
  //   return result;
  // }
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
