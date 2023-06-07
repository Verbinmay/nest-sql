import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { CreatePostBlogDto } from '../../blogger/dto/post/create-post-in-blog.dto';
import { UpdatePostByBlogDto } from '../../blogger/dto/post/update-post-by-blog.dto';
import { ViewPostDto } from '../../public/dto/post/view-post.dto';
import { PostLikes } from './post.like.entity';

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

  @Column('uuid')
  public blogId: string;

  @Column()
  public blogName: string;

  @Column('uuid')
  public userId: string;

  @Column({ type: 'boolean', default: false })
  public isBaned = false;

  @CreateDateColumn({ type: 'timestamp' })
  public createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  public updatedAt!: Date;

  // updateInfo(inputModel: UpdatePostByBlogDto) {
  //   this.title = inputModel.title;
  //   this.shortDescription = inputModel.shortDescription;
  //   this.content = inputModel.content;
  //   this.updatedAt = new Date().toISOString();
  //   return this;
  // }

  // getViewModel(userId: string): ViewPostDto {
  //   let status: 'None' | 'Like' | 'Dislike' = 'None';
  //   let likesCount = 0;
  //   let dislikeCount = 0;
  //   let newestLikes = [];
  //   if (this.extendedLikesInfo.length !== 0) {
  //     const like = this.extendedLikesInfo.find((m) => m.userId === userId);
  //     if (like) status = like.status;

  //     likesCount = this.extendedLikesInfo.filter(
  //       (m) => m.status === 'Like' && m.isBaned === false,
  //     ).length;

  //     dislikeCount = this.extendedLikesInfo.filter(
  //       (m) => m.status === 'Dislike' && m.isBaned === false,
  //     ).length;

  //     newestLikes = this.extendedLikesInfo
  //       .filter((m) => m.status === 'Like' && m.isBaned === false)
  //       .sort((a, b) => {
  //         const dateA = new Date(a.addedAt).getTime();
  //         const dateB = new Date(b.addedAt).getTime();
  //         return dateA - dateB;
  //       })
  //       .slice(-3)
  //       .map((a) => {
  //         return {
  //           addedAt: a.addedAt,
  //           userId: a.userId,
  //           login: a.login,
  //         };
  //       })
  //       .reverse();
  //   }
  //   const result = {
  //     id: this._id.toString(),
  //     title: this.title,
  //     shortDescription: this.shortDescription,
  //     content: this.content,
  //     blogId: this.blogId,
  //     blogName: this.blogName,
  //     createdAt: this.createdAt,
  //     extendedLikesInfo: {
  //       likesCount: likesCount,
  //       dislikesCount: dislikeCount,
  //       myStatus: status,
  //       newestLikes: newestLikes,
  //     },
  //   };
  //   return result;
  // }
}

export function getPostViewModel(
  post: Post,
  likes: Array<PostLikes>,
  userId: string,
): ViewPostDto {
  let status: 'None' | 'Like' | 'Dislike' = 'None';
  let likesCount = 0;
  let dislikeCount = 0;
  let newestLikes = [];
  if (likes.length !== 0) {
    const like = likes.find((m) => m.userId === userId);
    if (like) status = like.status;

    likesCount = likes.filter(
      (m) => m.status === 'Like' && m.isBaned === false && m.postId === post.id,
    ).length;

    dislikeCount = likes.filter(
      (m) =>
        m.status === 'Dislike' && m.isBaned === false && m.postId === post.id,
    ).length;

    newestLikes = likes
      .filter(
        (m) =>
          m.status === 'Like' && m.isBaned === false && m.postId === post.id,
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
          userId: a.userId,
          login: a.login,
        };
      })
      .reverse();
  }
  return {
    id: post.id,
    title: post.title,
    shortDescription: post.shortDescription,
    content: post.content,
    blogId: post.blogId,
    blogName: post.blogName,
    createdAt: post.createdAt.toISOString(),
    extendedLikesInfo: {
      likesCount: likesCount,
      dislikesCount: dislikeCount,
      myStatus: status,
      newestLikes: newestLikes,
    },
  };
}
