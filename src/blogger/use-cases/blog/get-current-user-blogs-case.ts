import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { PaginationQuery } from '../../../pagination/base-pagination';
import { PaginatorBlog } from '../../../pagination/paginatorType';
import { BlogQueryRepository } from '../../../sql/blog.query.repository';

export class GetCurrentUserBlogsCommand {
  constructor(public userId: string, public query: PaginationQuery) {}
}

@CommandHandler(GetCurrentUserBlogsCommand)
export class GetCurrentUserBlogsCase
  implements ICommandHandler<GetCurrentUserBlogsCommand>
{
  constructor(private readonly blogRepository: BlogQueryRepository) {}

  async execute(command: GetCurrentUserBlogsCommand) {
    const result: PaginatorBlog = await this.blogRepository.findBlogsByUserId(
      command.query,
      command.userId,
    );

    return result;
  }
}
