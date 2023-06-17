import {
  Comment,
  getCommentViewModel,
  getCommentWithPostInfoViewModel,
} from '../entities/sql/comment.entity';
import {
  PaginatorCommentWithLikeViewModel,
  PaginatorCommentWithWithPostInfoViewModel,
  PaginatorEnd,
} from '../pagination/paginatorType';
import { In, Repository } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { PaginationQuery } from '../pagination/base-pagination';

@Injectable()
export class CommentQueryRepository {
  constructor(
    @InjectRepository(Comment)
    private readonly commentsRepository: Repository<Comment>,
  ) {}

  async getCommentsWithPostInfoByPostsId(
    query: PaginationQuery,
    postsId: Array<string>,
    userId: string,
  ) {
    const totalCount: number = await this.commentsRepository.count({
      relations: {
        post: true,
        user: true,
        likes: { comment: true, user: true },
      },
      where: {
        post: { id: In(postsId) },
        isBanned: false,
      },
    });

    const pagesCount = query.countPages(totalCount);

    const commentsFromDB: Array<Comment> = await this.commentsRepository.find({
      relations: {
        post: true,
        user: true,
        likes: { comment: true, user: true },
      },
      where: {
        post: { id: In(postsId) },
        isBanned: false,
      },
      order: {
        [query.sortBy]: query.sortDirection,
      },
      skip: query.skip(),
      take: query.pageSize,
    });
    const comments = commentsFromDB.map((m) =>
      getCommentWithPostInfoViewModel(m, userId),
    );
    const result: PaginatorCommentWithWithPostInfoViewModel = {
      pagesCount: pagesCount,
      page: query.pageNumber,
      pageSize: query.pageSize,
      totalCount: totalCount,
      items: comments,
    };
    return result;
  }

  async getCommentsByPostId(
    query: PaginationQuery,
    postsId: string,
    userId: string,
  ) {
    const totalCount: number = await this.commentsRepository.count({
      relations: {
        post: true,
        user: true,
        likes: { comment: true, user: true },
      },
      where: {
        post: { id: postsId },
        isBanned: false,
      },
    });

    const pagesCount = query.countPages(totalCount);

    const commentsFromDB: Array<Comment> = await this.commentsRepository.find({
      relations: {
        post: true,
        user: true,
        likes: { comment: true, user: true },
      },
      where: {
        post: { id: postsId },
        isBanned: false,
      },
      order: {
        [query.sortBy]: query.sortDirection,
      },
      skip: query.skip(),
      take: query.pageSize,
    });
    const comments = commentsFromDB.map((m) => getCommentViewModel(m, userId));
    const result: PaginatorCommentWithLikeViewModel = {
      pagesCount: pagesCount,
      page: query.pageNumber,
      pageSize: query.pageSize,
      totalCount: totalCount,
      items: comments,
    };
    return result;
  }
}
