import { ILike, Like, Repository } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { ViewBlogDto } from '../blogger/dto/blog/view-blog.dto';
import { Blog, getBlogViewModel } from '../entities/sql/blog.entity';
import { PaginationQuery } from '../pagination/base-pagination';
import { PaginatorBlog } from '../pagination/paginatorType';

@Injectable()
export class BlogQueryRepository {
  constructor(
    @InjectRepository(Blog) private readonly blogsRepository: Repository<Blog>,
  ) {}

  //   async findCountBlogs(filter: any) {
  //     return await this.BlogModel.countDocuments(filter);
  //   }

  async findBlogsByUserId(query: PaginationQuery, userId: string) {
    const totalCount: number = await this.blogsRepository.count({
      where: {
        userId: userId,
        name: ILike('%' + query.searchNameTerm + '%'),
      },
    });

    const pagesCount = query.countPages(totalCount);

    const blogsFromDB: Array<Blog> = await this.blogsRepository.find({
      where: {
        userId: userId,
        name: ILike('%' + query.searchNameTerm + '%'),
      },
      order: {
        [query.sortBy]: query.sortDirection,
      },
      skip: query.skip(),
      take: query.pageSize,
    });

    const blogs: ViewBlogDto[] = blogsFromDB.map((m) => getBlogViewModel(m));

    const result: PaginatorBlog = {
      pagesCount: pagesCount,
      page: query.pageNumber,
      pageSize: query.pageSize,
      totalCount: totalCount,
      items: blogs,
    };
    return result;
  }

  async findBlogs(query: PaginationQuery) {
    const totalCount: number = await this.blogsRepository.count({
      where: {
        name: ILike('%' + query.searchNameTerm + '%'),
        isBanned: false,
      },
    });

    const pagesCount = query.countPages(totalCount);

    const blogsFromDB: Array<Blog> = await this.blogsRepository.find({
      where: {
        name: ILike('%' + query.searchNameTerm + '%'),
        isBanned: false,
      },
      order: {
        [query.sortBy]: query.sortDirection,
      },
      skip: query.skip(),
      take: query.pageSize,
    });

    const blogs: ViewBlogDto[] = blogsFromDB.map((m) => getBlogViewModel(m));

    const result: PaginatorBlog = {
      pagesCount: pagesCount,
      page: query.pageNumber,
      pageSize: query.pageSize,
      totalCount: totalCount,
      items: blogs,
    };
    return result;
  }
}
