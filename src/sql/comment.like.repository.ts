import { In, Repository } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Comment } from '../entities/sql/comment.entity';
import { CommentLike } from '../entities/sql/comment.like.entity';

@Injectable()
export class LikeCommentRepository {
  constructor(
    @InjectRepository(CommentLike)
    private readonly commentLikesRepository: Repository<CommentLike>,
  ) {}

  async create(like: CommentLike) {
    await this.commentLikesRepository.create(like);
    return await this.commentLikesRepository.save(like);
  }

  async update(like: CommentLike) {
    return await this.commentLikesRepository.save(like);
  }

  async delete(likeId: string) {
    return await this.commentLikesRepository.delete({
      id: likeId,
    });
  }

  async findLikeByUserId(userId: string) {
    return await this.commentLikesRepository.findOneBy({
      userId: userId,
    });
  }

  async findLikesForComments(comments: Array<Comment>) {
    return await this.commentLikesRepository.findBy({
      commentId: In(comments.map((p) => p.id)),
    });
  }

  async truncate(): Promise<void> {
    return await this.commentLikesRepository.clear();
  }

  async banLikeCommentByUserId(userId: string, isBanned: boolean) {
    return await this.commentLikesRepository.update(
      { userId: userId },
      { isBanned: isBanned },
    );
  }
}
