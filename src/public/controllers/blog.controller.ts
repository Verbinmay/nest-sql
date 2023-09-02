import {
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { log } from 'console';

import { CommandBus } from '@nestjs/cqrs';

import { JwtAuthGuard } from '../../guard/auth-passport/guard-passport/jwt-auth.guard';
import { CurrentPayload } from '../../decorator/currentUser.decorator';
import { makeAnswerInController } from '../../helpers/errors';
import { PaginationQuery } from '../../pagination/base-pagination';
import { GetAllBlogsCommand } from '../use-cases/blog/get-all-blogs-case';
import { GetBlogByBlogIdCommand } from '../use-cases/blog/get-blog-by-blog-id-case';
import { PostSubscriptionOnBlogCommand } from '../use-cases/blog/subscription-case';
import { DeleteSubscriptionOnBlogCommand } from '../use-cases/blog/unsubscription-case';
import { GetAllPostsByBlogIdCommand } from '../use-cases/post/get-posts-by-blog-id-case';

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
  @UseGuards(JwtAuthGuard)
  @HttpCode(204)
  @Post(':blogId/subscription')
  async postSubscription(
    @Param('blogId') blogId: string,
    @CurrentPayload() user,
  ) {
    const userId = user ? user.sub : '';
    const result = await this.commandBus.execute(
      new PostSubscriptionOnBlogCommand(userId, blogId),
    );
    return makeAnswerInController(result);
  }
  @UseGuards(JwtAuthGuard)
  @HttpCode(204)
  @Delete(':blogId/subscription')
  async deleteSubscription(
    @Param('blogId') blogId: string,
    @CurrentPayload() user,
  ) {
    const userId = user ? user.sub : '';
    const result = await this.commandBus.execute(
      new DeleteSubscriptionOnBlogCommand(userId, blogId),
    );
    return makeAnswerInController(result);
  }
}
