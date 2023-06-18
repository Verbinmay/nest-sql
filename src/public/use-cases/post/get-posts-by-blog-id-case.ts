import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { Blog } from '../../../entities/sql/blog.entity';
import { getPostViewModel } from '../../../entities/sql/post.entity';
import { PaginationQuery } from '../../../pagination/base-pagination';
import { PaginatorPost } from '../../../pagination/paginatorType';
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

    const postsWithPaginator: PaginatorPost =
      await this.postRepository.findPostsByBlogId(
        command.query,
        command.blogId,
        command.userId,
      );

    return postsWithPaginator;
  }
}
