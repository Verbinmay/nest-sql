import { Repository } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Blog } from '../entities/sql/blog.entity';
import { UserFollowBlog } from '../entities/sql/userFollowBlog.entity';

@Injectable()
export class FollowerRepository {
  constructor(
    @InjectRepository(UserFollowBlog)
    private readonly followerRepository: Repository<UserFollowBlog>,
  ) {}

  async create(UserFollowBlog: UserFollowBlog) {
    try {
      await this.followerRepository.create(UserFollowBlog);
      return await this.followerRepository.save(UserFollowBlog);
    } catch (e) {
      return null;
    }
  }

  async update(UserFollowBlog: UserFollowBlog): Promise<UserFollowBlog> {
    return await this.followerRepository.save(UserFollowBlog);
  }

  async findByUserIdAndBlogId(
    userId: string,
    blogId: string,
  ): Promise<UserFollowBlog> {
    const result = await this.followerRepository.findOneBy({
      userId: userId,
      blogId: blogId,
    });

    return result;
  }

  async deleteAll() {
    return await this.followerRepository.delete({});
  }
}
