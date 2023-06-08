import { In, Repository } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Comment } from '../entities/sql/comment.entity';
import { PaginationQuery } from '../pagination/base-pagination';
import { PaginatorEnd } from '../pagination/paginatorType';

@Injectable()
export class CommentQueryRepository {
  constructor(
    @InjectRepository(Comment)
    private readonly commentsRepository: Repository<Comment>,
  ) {}

  async getCommentsByPostsId(query: PaginationQuery, postsId: Array<string>) {
    const totalCount: number = await this.commentsRepository.count({
      where: {
        postId: In(postsId),
        isBaned: false,
      },
    });

    const pagesCount = query.countPages(totalCount);

    const commentsFromDB: Array<Comment> = await this.commentsRepository.find({
      where: {
        postId: In(postsId),
        isBaned: false,
      },
      order: {
        [query.sortBy]: query.sortDirection,
      },
      skip: query.skip(),
      take: query.pageSize,
    });

    const result: PaginatorEnd & {
      items: Array<Comment>;
    } = {
      pagesCount: pagesCount,
      page: query.pageNumber,
      pageSize: query.pageSize,
      totalCount: totalCount,
      items: commentsFromDB,
    };
    return result;
  }
}
