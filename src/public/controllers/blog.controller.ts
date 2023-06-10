import { Controller, Get, Param, Query } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';

import { CurrentPayload } from '../../decorator/currentUser.decorator';
import { makeAnswerInController } from '../../helpers/errors';
import { PaginationQuery } from '../../pagination/base-pagination';
import { GetAllBlogsCommand } from '../use-cases/blog/get-all-blogs-case';
import { GetBlogByBlogIdCommand } from '../use-cases/blog/get-blog-by-blog-id-case';
import { GetAllPostsByBlogIdCommand } from '../use-cases/post/get-post-by-blog-id-case';

@Controller('blogs')
export class BlogController {
  constructor(private commandBus: CommandBus) {}

  @Get(':id')
  async getBlogByBlogId(@Param('id') id: string) {
    const result = await this.commandBus.execute(
      new GetBlogByBlogIdCommand(id),
    );
    return makeAnswerInController(result);
  }
  @Get()
  async getAllBlogs(@Query() query: PaginationQuery) {
    const result = await this.commandBus.execute(new GetAllBlogsCommand(query));
    return makeAnswerInController(result);
  }

  @Get(':blogId/posts')
  async getPostByBlogId(
    @Param('blogId') blogId: string,
    @Query() query: PaginationQuery,
    @CurrentPayload() user,
  ) {
    const userId = user ? user.sub : '';

    const result = await this.commandBus.execute(
      new GetAllPostsByBlogIdCommand(blogId, userId, query),
    );
    return makeAnswerInController(result);
  }
}
