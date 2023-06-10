import {
  PaginatorCommentWithLikeViewModel,
  PaginatorEnd,
} from '../../../pagination/paginatorType';
import {
  Comment,
  getCommentViewModel,
} from '../../../entities/sql/comment.entity';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { CommentLike } from '../../../entities/sql/comment.like.entity';
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

    const commentsFromDbWithPagination: PaginatorEnd & {
      items: Array<Comment>;
    } = await this.commentQueryRepository.getCommentsByPostsId(command.query, [
      post.id,
    ]);

    const likesCommentsFromDb: Array<CommentLike> =
      await this.likeCommentRepository.findLikesForComments(
        commentsFromDbWithPagination.items,
      );

    const result: PaginatorCommentWithLikeViewModel = {
      ...commentsFromDbWithPagination,
      items: commentsFromDbWithPagination.items.map((c) =>
        getCommentViewModel(c, likesCommentsFromDb, command.userId),
      ),
    };
    return result;
  }
}
