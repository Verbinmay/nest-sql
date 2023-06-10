import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { getPostViewModel } from '../../../entities/sql/post.entity';
import { PaginationQuery } from '../../../pagination/base-pagination';
import { PaginatorPost } from '../../../pagination/paginatorType';
import { LikePostRepository } from '../../../sql/post.like.repository';
import { PostQueryRepository } from '../../../sql/post.query.repository';

export class GetAllPostsCommand {
  constructor(public userId: string, public query: PaginationQuery) {}
}

@CommandHandler(GetAllPostsCommand)
export class GetAllPostsCase implements ICommandHandler<GetAllPostsCommand> {
  constructor(
    private readonly postRepository: PostQueryRepository,
    private readonly likePostRepository: LikePostRepository,
  ) {}

  async execute(command: GetAllPostsCommand) {
    const postsWithPaginator = await this.postRepository.findAllPosts(
      command.query,
    );

    const likes = await this.likePostRepository.findLikesForPosts(
      postsWithPaginator.items,
    );

    const result: PaginatorPost = {
      ...postsWithPaginator,
      items: postsWithPaginator.items.map((p) =>
        getPostViewModel(p, likes, command.userId),
      ),
    };
    return result;
  }
}
