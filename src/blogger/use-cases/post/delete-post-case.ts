import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { Post } from '../../../entities/sql/post.entity';
import { BlogRepository } from '../../../sql/blog.repository';
import { PostRepository } from '../../../sql/post.repository';

export class DeletePostCommand {
  constructor(
    public blogId: string,
    public postId: string,
    public userId: string,
  ) {}
}

@CommandHandler(DeletePostCommand)
export class DeletePostCase implements ICommandHandler<DeletePostCommand> {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly blogRepository: BlogRepository,
  ) {}

  async execute(command: DeletePostCommand) {
    const blog = await this.blogRepository.findBlogById(command.blogId);
    if (!blog) return { s: 404 };
    if (blog.user.id !== command.userId) return { s: 403 };

    const post: Post | null = await this.postRepository.findPostById(
      command.postId,
    );
    if (!post) return { s: 404 };
    const postDelete = await this.postRepository.delete(command.postId);
    if (!(postDelete.affected > 0)) {
      return { s: 500 };
    }
    return postDelete;
  }
}
