import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { getPostViewModel } from '../../../entities/sql/post.entity';
import { LikePostRepository } from '../../../sql/post.like.repository';
import { PostRepository } from '../../../sql/post.repository';

export class GetPostByIdCommand {
  constructor(public id: string, public userId: string) {}
}

@CommandHandler(GetPostByIdCommand)
export class GetPostByIdCase implements ICommandHandler<GetPostByIdCommand> {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly likePostRepository: LikePostRepository,
  ) {}

  async execute(command: GetPostByIdCommand) {
    const post = await this.postRepository.findPostById(command.id);
    if (!post || post.isBanned === true) {
      return { s: 404 };
    }

    return getPostViewModel(post, command.userId);
  }
}
