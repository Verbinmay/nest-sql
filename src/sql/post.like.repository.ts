import { In, Repository } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { InjectRepository } from '@nestjs/typeorm';

import { Post } from '../entities/sql/post.entity';
import { PostLike } from '../entities/sql/post.like.entity';

@Injectable()
export class LikePostRepository {
  constructor(
    @InjectRepository(PostLike)
    private readonly likesPostRepository: Repository<PostLike>,
  ) {}

  async create(like: PostLike) {
    await this.likesPostRepository.create(like);
    return await this.likesPostRepository.save(like);
  }
  async update(like: PostLike) {
    return await this.likesPostRepository.save(like);
  }
  async delete(likeId: string) {
    return await this.likesPostRepository.delete({ id: likeId });
  }

  async findLikeByUserId(userId: string, postId: string) {
    try {
      return await this.likesPostRepository.findOne({
        relations: { user: true, post: true },
        where: {
          user: { id: userId },
          post: { id: postId },
        },
      });
    } catch (error) {
      return null;
    }
  }
  async findLikesForPosts(posts: Array<Post>) {
    return await this.likesPostRepository.find({
      relations: { post: true, user: true },
      where: {
        post: { id: In(posts.map((p) => p.id)) },
      },
    });
  }
  async deleteAll() {
    return await this.likesPostRepository.delete({});
  }

  async banLikePostByUserId(userId: string, isBanned: boolean) {
    return await this.likesPostRepository.update(
      { user: { id: userId } },
      { isBanned: isBanned },
    );
  }
}
