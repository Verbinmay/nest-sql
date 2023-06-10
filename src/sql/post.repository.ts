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

  async truncate(): Promise<void> {
    return await this.postsRepository.clear();
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
  async findPostsByUserId(userId: string) {
    try {
      const result: Array<Post> = await this.postsRepository.findBy({
        userId: userId,
      });
      return result;
    } catch (error) {
      return null;
    }
  }

  async findPostById(id: string): Promise<Post> {
    try {
      return await this.postsRepository.findOneBy({ id: id });
    } catch (error) {
      return null;
    }
  }

  //testing
  async findPost_test() {
    return await this.postsRepository.find({
      // relations: {
      //   likes: true,
      // },
    });
  }

  async delete(id: string) {
    return await this.postsRepository.delete({ id: id });
  }

  async banPostByUserId(userId: string, isBanned: boolean) {
    return await this.postsRepository.update(
      { userId: userId },
      { isBanned: isBanned },
    );
  }

  async banPostByBlogId(blogId: string, isBanned: boolean) {
    return await this.postsRepository.update(
      { blogId: blogId },
      { isBanned: isBanned },
    );
  }
}
