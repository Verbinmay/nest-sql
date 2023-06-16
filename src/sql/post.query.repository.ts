import { Repository } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Post } from '../entities/sql/post.entity';
import { PaginationQuery } from '../pagination/base-pagination';
import { PaginatorEnd } from '../pagination/paginatorType';

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

  async findAllPosts(query: PaginationQuery) {
    const totalCount: number = await this.postsRepository.count({
      relations: { blog: true },
      where: {
        isBanned: false,
      },
    });

    const pagesCount = query.countPages(totalCount);

    const postsFromDB: Array<Post> = await this.postsRepository.find({
      relations: { blog: true },
      where: {
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
}
