import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { PaginationQuery } from '../../../pagination/base-pagination';
import { PaginatorBlog } from '../../../pagination/paginatorType';
import { BlogQueryRepository } from '../../../sql/blog.query.repository';

export class GetAllBlogsCommand {
  constructor(public query: PaginationQuery) {}
}

@CommandHandler(GetAllBlogsCommand)
export class GetAllBlogsCase implements ICommandHandler<GetAllBlogsCommand> {
  constructor(private readonly blogQueryRepository: BlogQueryRepository) {}

  async execute(command: GetAllBlogsCommand) {
    const result: PaginatorBlog = await this.blogQueryRepository.findBlogs(
      command.query,
    );

    return result;
  }
}
