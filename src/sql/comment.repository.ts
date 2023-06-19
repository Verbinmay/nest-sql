import { Repository } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Comment } from '../entities/sql/comment.entity';

@Injectable()
export class CommentRepository {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
  ) {}
  async findById(id: string) {
    try {
      return await this.commentRepository.findOne({
        relations: {
          post: true,
          user: true,
          likes: { user: true },
        },
        where: { id: id },
      });
    } catch (error) {
      return null;
    }
  }

  async deleteAll() {
    return await this.commentRepository.delete({});
  }

  //   async findCountComments(filter: { name: { $regex: string } } | object) {
  //     return await this.CommentModel.countDocuments(filter);
  //   }
  //   async getCommentsByPostId(a: {
  //     find: { name: { $regex: string } } | object;
  //     sort: any;
  //     skip: number;
  //     limit: number;
  //   }) {
  //     const result: Array<Comment> = await this.CommentModel.find(a.find)
  //       .sort(a.sort)
  //       .skip(a.skip)
  //       .limit(a.limit);

  //     return result;
  //   }

  async create(comment: Comment) {
    await this.commentRepository.create(comment);
    return await this.commentRepository.save(comment);
  }

  async update(comment: Comment) {
    return await this.commentRepository.save(comment);
  }

  async delete(commentId: string) {
    const result = await this.commentRepository.delete(commentId);
    return result.affected > 0;
  }

  async banCommentByUserId(userId: string, isBanned: boolean) {
    return await this.commentRepository.update(
      { user: { id: userId } },
      { isBanned: isBanned },
    );
  }
}
