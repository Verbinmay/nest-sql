import { In, Repository } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { InjectRepository } from '@nestjs/typeorm';

import { Post } from '../entities/sql/post.entity';
import { PostLikes } from '../entities/sql/post.like.entity';

@Injectable()
export class LikePostRepository {
  constructor(
    @InjectRepository(PostLikes)
    private readonly postLikesRepository: Repository<PostLikes>,
  ) {}

  // async create(post: Post) {
  //   await this.usersRepository.create(post);
  //   return await this.usersRepository.save(post);
  // }

  async findLikesForPosts(posts: Array<Post>) {
    return await this.postLikesRepository.findBy({
      postId: In(posts.map((p) => p.id)),
    });
  }
}
