import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  Put,
  HttpCode,
  UseGuards,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';

import { JwtAuthGuard } from '../../guard/auth-passport/guard-passport/jwt-auth.guard';
import { CurrentPayload } from '../../decorator/currentUser.decorator';
import { makeAnswerInController } from '../../helpers/errors';
import { PaginationQuery } from '../../pagination/base-pagination';
import { CreateCommentDto } from '../dto/comment/create-comment.dto';
import { LikeDto } from '../dto/likes/like.dto';
import { PostCommentByBlogIdCommand } from '../use-cases/comment/create-comment-by-post-id-case';
import { GetAllCommentsByPostIdCommand } from '../use-cases/comment/get-all-comments-by-post-id-case';
import { GetAllPostsCommand } from '../use-cases/post/get-all-posts-case';
import { GetPostByIdCommand } from '../use-cases/post/get-post-by-id-case';
import { LikePostCommand } from '../use-cases/post/like-post-case';

@Controller('posts')
export class PostController {
  constructor(private commandBus: CommandBus) {}

  @Get()
  async getAllPosts(@Query() query: PaginationQuery, @CurrentPayload() user) {
    const userId = user ? user.sub : '';
    const result = await this.commandBus.execute(
      new GetAllPostsCommand(userId, query),
    );
    return makeAnswerInController(result);
  }

  @Get(':id')
  async GetPostById(@Param('id') id: string, @CurrentPayload() user) {
    const userId = user ? user.sub : '';
    const result = await this.commandBus.execute(
      new GetPostByIdCommand(id, userId),
    );
    return makeAnswerInController(result);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':postId/like-status')
  @HttpCode(204)
  async updateLikeStatus(
    @Param('postId') postId: string,
    @Body() inputModel: LikeDto,
    @CurrentPayload() user,
  ) {
    const userId = user ? user.sub : '';
    const result = await this.commandBus.execute(
      new LikePostCommand(postId, userId, inputModel),
    );
    return makeAnswerInController(result);
  }

  @Get(':postId/comments')
  async getCommentsByPostId(
    @Param('postId') postId: string,
    @Query() query: PaginationQuery,
    @CurrentPayload() user,
  ) {
    const userId = user ? user.sub : '';

    const result = await this.commandBus.execute(
      new GetAllCommentsByPostIdCommand(postId, userId, query),
    );
    return makeAnswerInController(result);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':postId/comments')
  async createCommentByPostId(
    @Param('postId') postId: string,
    @Body() inputModel: CreateCommentDto,
    @CurrentPayload() user,
  ) {
    const userId = user ? user.sub : '';

    const result = await this.commandBus.execute(
      new PostCommentByBlogIdCommand(postId, userId, inputModel),
    );
    return makeAnswerInController(result);
  }
}
