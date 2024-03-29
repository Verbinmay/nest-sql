import { Repository } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Post } from '../entities/sql/post.entity';

@Injectable()
export class PostRepository {
  constructor(
    @InjectRepository(Post) private readonly postsRepository: Repository<Post>,
  ) {}

  async create(post: Post): Promise<Post> {
    await this.postsRepository.create(post);
    return await this.postsRepository.save(post);
  }

  async update(post: Post) {
    return await this.postsRepository.save(post);
  }

  async deleteAll() {
    return await this.postsRepository.delete({});
  }

  async findPostsByUserId(userId: string) {
    try {
      const result: Array<Post> = await this.postsRepository.find({
        relations: { user: true, blog: true, images: true },
        where: {
          user: { id: userId },
        },
      });
      return result;
    } catch (error) {
      return null;
    }
  }

  async findPostById(id: string): Promise<Post> {
    try {
      return await this.postsRepository.findOne({
        relations: {
          blog: true,
          user: true,
          likes: { user: true },
          images: true,
        },
        where: { id: id },
      });
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

  async delete(id: string): Promise<boolean> {
    const result = await this.postsRepository.delete({ id: id });

    return result.affected > 0;
  }

  async banPostByUserId(userId: string, isBanned: boolean) {
    return await this.postsRepository.update(
      { user: { id: userId } },
      { isBanned: isBanned },
    );
  }

  async banPostByBlogId(blogId: string, isBanned: boolean) {
    return await this.postsRepository.update(
      { blog: { id: blogId } },
      { isBanned: isBanned },
    );
  }
}
