import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { PaginationQuery } from '../../../pagination/base-pagination';
import { PaginatorBlog } from '../../../pagination/paginatorType';
import { BlogQueryRepository } from '../../../sql/blog.query.repository';

export class SA_GetAllBlogsCommand {
  constructor(public query: PaginationQuery) {}
}

@CommandHandler(SA_GetAllBlogsCommand)
export class SA_GetAllBlogsCase
  implements ICommandHandler<SA_GetAllBlogsCommand>
{
  constructor(private readonly blogQueryRepository: BlogQueryRepository) {}

  async execute(command: SA_GetAllBlogsCommand) {
    const result: PaginatorBlog = await this.blogQueryRepository.findBlogs(
      command.query,
    );

    return result;
  }
}
