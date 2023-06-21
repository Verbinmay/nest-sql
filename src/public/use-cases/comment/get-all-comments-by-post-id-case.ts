import { PaginatorCommentWithLikeViewModel } from '../../../pagination/paginatorType';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { PaginationQuery } from '../../../pagination/base-pagination';
import { LikeCommentRepository } from '../../../sql/comment.like.repository';
import { CommentQueryRepository } from '../../../sql/comment.query.repository';
import { PostRepository } from '../../../sql/post.repository';

export class GetAllCommentsByPostIdCommand {
  constructor(
    public postId: string,
    public userId: string,
    public query: PaginationQuery,
  ) {}
}

@CommandHandler(GetAllCommentsByPostIdCommand)
export class GetAllCommentsByPostIdCase
  implements ICommandHandler<GetAllCommentsByPostIdCommand>
{
  constructor(
    private readonly commentQueryRepository: CommentQueryRepository,
    private readonly postRepository: PostRepository,
    private readonly likeCommentRepository: LikeCommentRepository,
  ) {}

  async execute(command: GetAllCommentsByPostIdCommand) {
    const post = await this.postRepository.findPostById(command.postId);
    if (!post) return { s: 404 };

    const result: PaginatorCommentWithLikeViewModel =
      await this.commentQueryRepository.getCommentsByPostId(
        command.query,
        post.id,
        command.userId,
      );

    return result;
  }
}
