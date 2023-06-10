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
    return await this.commentRepository.findOneBy({ id: id });
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
    return await this.commentRepository.delete(commentId);
  }

  //   async banCommentByUserId(userId: string, isBanned: boolean) {
  //     try {
  //       await this.CommentModel.updateMany(
  //         { 'commentatorInfo.userId': userId },
  //         { $set: { isBaned: isBanned } },
  //       );
  //       await this.CommentModel.updateMany(
  //         {},
  //         { $set: { 'likesInfo.$[elem].isBaned': isBanned } },
  //         { arrayFilters: [{ 'elem.userId': userId }] },
  //       );
  //       return true;
  //     } catch (error) {
  //       return null;
  //     }
  //   }
}
