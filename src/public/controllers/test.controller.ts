import { Controller, Delete, Get, HttpCode, Param } from '@nestjs/common';

import { BanedUsersBlogsRepository } from '../../sql/blog.banUsers.repository';
import { BlogRepository } from '../../sql/blog.repository';
import { LikeCommentRepository } from '../../sql/comment.like.repository';
import { CommentRepository } from '../../sql/comment.repository';
import { LikePostRepository } from '../../sql/post.like.repository';
import { PostRepository } from '../../sql/post.repository';
import { SessionRepository } from '../../sql/sessions.repository';
import { UserRepository } from '../../sql/user.repository';

@Controller('testing')
export class TestController {
  constructor(
    private readonly banedUsersBlogsRepository: BanedUsersBlogsRepository,
    private readonly blogRepository: BlogRepository,
    private readonly commentRepository: CommentRepository,
    private readonly likeCommentRepository: LikeCommentRepository,
    private readonly likePostRepository: LikePostRepository,
    private readonly postRepository: PostRepository,
    private readonly sessionRepository: SessionRepository,
    private readonly userRepository: UserRepository,
  ) {}

  @HttpCode(204)
  @Delete('all-data')
  async deleteAll() {
    await this.banedUsersBlogsRepository.deleteAll();
    await this.likeCommentRepository.deleteAll();
    await this.likePostRepository.deleteAll();
    await this.sessionRepository.deleteAll();
    await this.commentRepository.deleteAll();
    await this.postRepository.deleteAll();
    await this.blogRepository.deleteAll();
    await this.userRepository.deleteAll();

    return;
  }

  @Get('user/:login')
  async getUsers(@Param('login') login: string) {
    return await this.userRepository.findUsersByLogin(login);
  }

  @Get('posts')
  async getPosts() {
    return await this.postRepository.findPost_test();
  }
}
