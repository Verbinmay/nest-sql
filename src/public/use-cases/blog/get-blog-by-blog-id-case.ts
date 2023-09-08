import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { getBlogViewModel } from '../../../entities/sql/blog.entity';
import { BlogRepository } from '../../../sql/blog.repository';

export class GetBlogByBlogIdCommand {
  constructor(public id: string, public userId: string) {}
}

@CommandHandler(GetBlogByBlogIdCommand)
export class GetBlogByBlogIdCase
  implements ICommandHandler<GetBlogByBlogIdCommand>
{
  constructor(private readonly blogRepository: BlogRepository) {}

  async execute(command: GetBlogByBlogIdCommand) {
    const blog = await this.blogRepository.findBlogById(command.id);
    if (!blog || blog.isBanned === true) {
      return { s: 404 };
    }
    return await getBlogViewModel(blog, command.userId);
  }
}
