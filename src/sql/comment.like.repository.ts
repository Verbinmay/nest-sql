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

  async findLikeByUserId(userId: string, commentId: string) {
    try {
      return await this.commentLikesRepository.findOne({
        relations: {
          user: true,
          comment: true,
        },
        where: {
          user: { id: userId },
          comment: { id: commentId },
        },
      });
    } catch (error) {
      return null;
    }
  }

  async findLikesForComments(comments: Array<Comment>) {
    return await this.commentLikesRepository.find({
      relations: { comment: true, user: true },
      where: {
        comment: { id: In(comments.map((p) => p.id)) },
      },
    });
  }

  async deleteAll() {
    return await this.commentLikesRepository.delete({});
  }

  async banLikeCommentByUserId(userId: string, isBanned: boolean) {
    return await this.commentLikesRepository.update(
      { user: { id: userId } },
      { isBanned: isBanned },
    );
  }
}
