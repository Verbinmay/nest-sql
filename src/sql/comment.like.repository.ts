import { In, Repository } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Comment } from '../entities/sql/comment.entity';
import { CommentLikes } from '../entities/sql/comment.like.entity';

@Injectable()
export class LikeCommentRepository {
  constructor(
    @InjectRepository(CommentLikes)
    private readonly commentLikesRepository: Repository<CommentLikes>,
  ) {}

  // async create(post: Post) {
  //   await this.usersRepository.create(post);
  //   return await this.usersRepository.save(post);
  // }

  async findLikesForComments(comments: Array<Comment>) {
    return await this.commentLikesRepository.findBy({
      commentId: In(comments.map((p) => p.id)),
    });
  }
}
