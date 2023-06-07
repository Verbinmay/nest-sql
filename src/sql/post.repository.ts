import { Repository } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Post } from '../entities/sql/post.entity';

@Injectable()
export class PostRepository {
  constructor(
    @InjectRepository(Post) private readonly postsRepository: Repository<Post>,
  ) {}

  async create(post: Post) {
    await this.postsRepository.create(post);
    return await this.postsRepository.save(post);
  }

  async update(post: Post) {
    return await this.postsRepository.save(post);
  }

  // async findCountPosts(filter: object) {
  //   return await this.PostModel.countDocuments(filter);
  // }

  // async findPostsWithPagination(a: {
  //   find: object;
  //   sort: any;
  //   skip: number;
  //   limit: number;
  // }) {
  //   const result: Array<Post> = await this.PostModel.find(a.find)
  //     .sort(a.sort)
  //     .skip(a.skip)
  //     .limit(a.limit);

  //   return result;
  // }
  // async findPostsByUserId(filter) {
  //   const result: Array<Post> = await this.PostModel.find(filter);
  //   return result;
  // }

  async findPostById(id: string): Promise<Post> {
    return await this.postsRepository.findOneBy({ id: id });
  }

  async delete(id: string) {
    return await this.postsRepository.delete({ id: id });
  }

  // async banPostByUserId(userId: string, isBanned: boolean) {
  //   try {
  //     await this.PostModel.updateMany(
  //       { userId: userId },
  //       { $set: { isBaned: isBanned } },
  //     );
  //     await this.PostModel.updateMany(
  //       {},
  //       { $set: { 'extendedLikesInfo.$[elem].isBaned': isBanned } },
  //       { arrayFilters: [{ 'elem.userId': userId }] },
  //     );

  //     return true;
  //   } catch (error) {
  //     return null;
  //   }
  // }
  // async banPostByBlogId(blogId: string, isBanned: boolean) {
  //   try {
  //     await this.PostModel.updateMany(
  //       { blogId: blogId },
  //       { $set: { isBaned: isBanned } },
  //     );
  //     return true;
  //   } catch (error) {
  //     return null;
  //   }
  // }
}
