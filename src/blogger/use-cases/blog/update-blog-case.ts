import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { Blog } from '../../../entities/sql/blog.entity';
import { BlogRepository } from '../../../sql/blog.repository';
import { UpdateBlogDto } from '../../dto/blog/update-blog.dto';

export class UpdateBlogCommand {
  constructor(
    public blogId: string,
    public userId: string,
    public inputModel: UpdateBlogDto,
  ) {}
}

@CommandHandler(UpdateBlogCommand)
export class UpdateBlogCase implements ICommandHandler<UpdateBlogCommand> {
  constructor(private readonly blogRepository: BlogRepository) {}

  async execute(command: UpdateBlogCommand) {
    const blog: Blog | null = await this.blogRepository.findBlogById(
      command.blogId,
    );
    if (!blog) return { s: 404 };
    if (blog.user.id !== command.userId) return { s: 403 };

    blog.name = command.inputModel.name;
    blog.description = command.inputModel.description;
    blog.websiteUrl = command.inputModel.websiteUrl;
    const updatedBlog = await this.blogRepository.update(blog);

    if (!updatedBlog) return { s: 500 };
    return true;
  }
}
