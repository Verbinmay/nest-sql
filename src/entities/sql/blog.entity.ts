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
import { BanedUsers } from './blogsBannedUsers.entity';

@Entity()
export class Blog {
  // constructor(userId: string, userLogin: string, inputModel: CreateBlogDto) {
  //   this.name = inputModel.name;
  //   this.description = inputModel.description;
  //   this.websiteUrl = inputModel.websiteUrl;
  //   this.userId = userId;
  //   this.userLogin = userLogin;
  // }
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

  // updateInfo(inputModel: UpdateBlogDto) {
  //   this.name = inputModel.name;
  //   this.description = inputModel.description;
  //   this.websiteUrl = inputModel.websiteUrl;
  //   this.updatedAt = new Date().toISOString();
  //   return this;
  // }

  // getViewModel(): ViewBlogDto {
  //   const result = {
  //     id: this.id.toString(),
  //     name: this.name,
  //     description: this.description,
  //     websiteUrl: this.websiteUrl,
  //     createdAt: this.createdAt.toISOString(),
  //     isMembership: this.isMembership,
  //   };
  //   return result;
  // }

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

  // static createBlog(inputModel: CreateBlogDto): Blog {
  //   const blog = new Blog(inputModel);
  //   blog.name = inputModel.name;
  //   blog.description = inputModel.description;
  //   blog.websiteUrl = inputModel.websiteUrl;
  //   return blog;
  // }
}

// export const BlogSchema = SchemaFactory.createForClass(Blog);

// BlogSchema.methods = {
//   updateInfo: Blog.prototype.updateInfo,
//   getViewModel: Blog.prototype.getViewModel,
//   SAgetViewModel: Blog.prototype.SAgetViewModel,
// };

// // BlogSchema.statics = {
// //   createBlog: Blog.createBlog,
// // };

// export type BlogsDocument = HydratedDocument<Blog>;

// export type BlogsModelStaticType = {
//   createBlog: (inputModel: CreateBlogDto) => BlogsDocument;
// };
// export type BlogsModelMethodsType = {
//   updateInfo: (inputModel: UpdateBlogDto) => Blog;
//   getViewModel: () => ViewBlogDto;
//   SAgetViewModel: () => SAViewBlogDto;
// };

// export type BlogsModelType = Model<BlogsDocument> &
//   BlogsModelStaticType &
//   BlogsModelMethodsType;
