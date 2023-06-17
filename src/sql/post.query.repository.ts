import { Repository } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Post, getPostViewModel } from '../entities/sql/post.entity';
import { PaginationQuery } from '../pagination/base-pagination';
import { PaginatorEnd, PaginatorPost } from '../pagination/paginatorType';

@Injectable()
export class PostQueryRepository {
  constructor(
    @InjectRepository(Post) private readonly postsRepository: Repository<Post>,
  ) {}
  async findPostsByBlogId(query: PaginationQuery, blogId: string) {
    const totalCount: number = await this.postsRepository.count({
      relations: { blog: true },
      where: {
        blog: { id: blogId },
        isBanned: false,
      },
    });

    const pagesCount = query.countPages(totalCount);

    const postsFromDB: Array<Post> = await this.postsRepository.find({
      relations: { blog: true },
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

    const result: PaginatorEnd & { items: Post[] } = {
      pagesCount: pagesCount,
      page: query.pageNumber,
      pageSize: query.pageSize,
      totalCount: totalCount,
      items: postsFromDB,
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

    const postsFromDB: Array<Post> = await this.postsRepository.find({
      relations: { blog: true, user: true, likes: { user: true } },
      where: {
        isBanned: false,
      },
      order: {
        [query.sortBy]: query.sortDirection,
      },
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
