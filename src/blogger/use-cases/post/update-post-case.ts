import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { Post } from '../../../entities/sql/post.entity';
import { BlogRepository } from '../../../sql/blog.repository';
import { PostRepository } from '../../../sql/post.repository';
import { UpdatePostByBlogDto } from '../../dto/post/update-post-by-blog.dto';

export class UpdatePostCommand {
  constructor(
    public blogId: string,
    public postId: string,
    public userId: string,
    public inputModel: UpdatePostByBlogDto,
  ) {}
}

@CommandHandler(UpdatePostCommand)
export class UpdatePostCase implements ICommandHandler<UpdatePostCommand> {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly blogRepository: BlogRepository,
  ) {}

  async execute(command: UpdatePostCommand) {
    const blog = await this.blogRepository.findBlogById(command.blogId);
    if (!blog) return { s: 404 };
    if (blog.user.id !== command.userId) return { s: 403 };

    const post: Post | null = await this.postRepository.findPostById(
      command.postId,
    );
    if (!post) return { s: 404 };
    post.title = command.inputModel.title;
    post.shortDescription = command.inputModel.shortDescription;
    post.content = command.inputModel.content;

    return await this.postRepository.update(post);
  }
}
