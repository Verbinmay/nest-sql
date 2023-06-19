import { Repository, createQueryBuilder } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { ViewPostDto } from '../public/dto/post/view-post.dto';
import { Post, getPostViewModel } from '../entities/sql/post.entity';
import { PaginationQuery } from '../pagination/base-pagination';
import { PaginatorEnd, PaginatorPost } from '../pagination/paginatorType';

@Injectable()
export class PostQueryRepository {
  constructor(
    @InjectRepository(Post) private readonly postsRepository: Repository<Post>,
  ) {}
  async findPostsByBlogId(
    query: PaginationQuery,
    blogId: string,
    userId: string,
  ) {
    const totalCount: number = await this.postsRepository.count({
      relations: { blog: true, likes: { user: true } },
      where: {
        blog: { id: blogId },
        isBanned: false,
      },
    });

    const pagesCount = query.countPages(totalCount);

    const postsFromDB: Array<Post> = await this.postsRepository.find({
      relations: { blog: true, likes: { user: true } },
      where: {
        blog: { id: blogId },
        isBanned: false,
      },
      order: {
        [query.sortBy]: query.sortDirection,
      },
      skip: query.skip(),
      take: query.pageSize,
    });
    const post: ViewPostDto[] = postsFromDB.map((p) =>
      getPostViewModel(p, userId),
    );

    const result: PaginatorPost = {
      pagesCount: pagesCount,
      page: query.pageNumber,
      pageSize: query.pageSize,
      totalCount: totalCount,
      items: post,
    };
    return result;
  }

  async findAllPosts(query: PaginationQuery, userId: string) {
    const totalCount: number = await this.postsRepository.count({
      relations: { blog: true, user: true, likes: { user: true } },
      where: {
        isBanned: false,
      },
    });

    const pagesCount = query.countPages(totalCount);

    let orderInfo: any = {
      [query.sortBy]: query.sortDirection,
    };

    if (query.sortBy === 'blogName')
      orderInfo = { blog: { name: query.sortDirection } };
    if (query.sortBy === 'blogId')
      orderInfo = { blog: { id: query.sortDirection } };

    const postsFromDB: Array<Post> = await this.postsRepository.find({
      relations: { blog: true, user: true, likes: { user: true } },
      where: {
        isBanned: false,
      },
      order: orderInfo,
      skip: query.skip(),
      take: query.pageSize,
    });

    const post = postsFromDB.map((p) => getPostViewModel(p, userId));
    const result: PaginatorPost = {
      pagesCount: pagesCount,
      page: query.pageNumber,
      pageSize: query.pageSize,
      totalCount: totalCount,
      items: post,
    };
    return result;
  }
}
