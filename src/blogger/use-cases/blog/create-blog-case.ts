import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { Blog, getBlogViewModel } from '../../../entities/sql/blog.entity';
import { BlogRepository } from '../../../sql/blog.repository';
import { UserRepository } from '../../../sql/user.repository';
import { CreateBlogDto } from '../../dto/blog/create-blog.dto';

export class CreateBlogCommand {
  constructor(public userId: string, public inputModel: CreateBlogDto) {}
}

@CommandHandler(CreateBlogCommand)
export class CreateBlogCase implements ICommandHandler<CreateBlogCommand> {
  constructor(
    private readonly blogRepository: BlogRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async execute(command: CreateBlogCommand) {
    const user = await this.userRepository.findUserById(command.userId);
    if (!user) return { s: 404 };
    const blog: Blog = new Blog();
    blog.name = command.inputModel.name;
    blog.description = command.inputModel.description;
    blog.websiteUrl = command.inputModel.websiteUrl;
    blog.user = user;

    const result = await this.blogRepository.create(blog);
    return await getBlogViewModel(result);
  }
}
