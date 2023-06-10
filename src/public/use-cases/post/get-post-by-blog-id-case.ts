import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { Blog } from '../../../entities/sql/blog.entity';
import { getPostViewModel } from '../../../entities/sql/post.entity';
import { PaginationQuery } from '../../../pagination/base-pagination';
import { BlogRepository } from '../../../sql/blog.repository';
import { LikePostRepository } from '../../../sql/post.like.repository';
import { PostQueryRepository } from '../../../sql/post.query.repository';

export class GetAllPostsByBlogIdCommand {
  constructor(
    public blogId: string,
    public userId: string,
    public query: PaginationQuery,
  ) {}
}

@CommandHandler(GetAllPostsByBlogIdCommand)
export class GetAllPostsByBlogIdCase
  implements ICommandHandler<GetAllPostsByBlogIdCommand>
{
  constructor(
    private readonly blogRepository: BlogRepository,
    private readonly postRepository: PostQueryRepository,
    private readonly likePostRepository: LikePostRepository,
  ) {}

  async execute(command: GetAllPostsByBlogIdCommand) {
    const blog: Blog | null = await this.blogRepository.findBlogById(
      command.blogId,
    );
    if (!blog) {
      return { s: 404 };
    }

    const postsWithPaginator = await this.postRepository.findPostsByBlogId(
      command.query,
      command.blogId,
    );

    const likes = await this.likePostRepository.findLikesForPosts(
      postsWithPaginator.items,
    );

    return {
      ...postsWithPaginator,
      items: postsWithPaginator.items.map((p) =>
        getPostViewModel(p, likes, command.userId),
      ),
    };
  }
}
