import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { PaginationQuery } from '../../../pagination/base-pagination';
import { PaginatorBannedUsersViewModel } from '../../../pagination/paginatorType';
import { BanedUsersBlogsQueryRepository } from '../../../sql/blog.banUsers.query.repository';
import { BlogRepository } from '../../../sql/blog.repository';

export class GetBannedUsersByBlogIdCommand {
  constructor(
    public blogId: string,
    public userId: string,
    public query: PaginationQuery,
  ) {}
}

@CommandHandler(GetBannedUsersByBlogIdCommand)
export class GetBannedUsersByBlogIdCase
  implements ICommandHandler<GetBannedUsersByBlogIdCommand>
{
  constructor(
    private readonly blogRepository: BlogRepository,
    private readonly banedUsersBlogsQueryRepository: BanedUsersBlogsQueryRepository,
  ) {}

  async execute(command: GetBannedUsersByBlogIdCommand) {
    const blog = await this.blogRepository.findBlogById(command.blogId);
    if (!blog) return { s: 404 };
    if (blog.user.id !== command.userId) return { s: 403 };
    const result: PaginatorBannedUsersViewModel =
      await this.banedUsersBlogsQueryRepository.findBannedUsersByBlogId(
        command.query,
        command.blogId,
      );

    return result;
  }
}
