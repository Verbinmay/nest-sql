import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { BlogRepository } from '../../../sql/blog.repository';

export class DeleteBlogCommand {
  constructor(public blogId: string, public userId: string) {}
}

@CommandHandler(DeleteBlogCommand)
export class DeleteBlogCase implements ICommandHandler<DeleteBlogCommand> {
  constructor(private readonly blogRepository: BlogRepository) {}

  async execute(command: DeleteBlogCommand) {
    const blog = await this.blogRepository.findBlogById(command.blogId);
    if (!blog) return { s: 404 };
    if (blog.userId !== command.userId) return { s: 403 };

    const deletedBlog = await this.blogRepository.delete(command.blogId);

    if (!(deletedBlog.affected > 0)) {
      return { s: 500 };
    }
    return deletedBlog;
  }
}
