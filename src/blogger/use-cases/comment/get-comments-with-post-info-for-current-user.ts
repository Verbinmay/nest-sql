import {
  PaginatorCommentWithWithPostInfoViewModel,
  PaginatorEnd,
} from '../../../pagination/paginatorType';
import {
  Comment,
  getCommentWithPostInfoViewModel,
} from '../../../entities/sql/comment.entity';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { CommentLikes } from '../../../entities/sql/comment.like.entity';
import { Post } from '../../../entities/sql/post.entity';
import { PaginationQuery } from '../../../pagination/base-pagination';
import { LikeCommentRepository } from '../../../sql/comment.like.repository';
import { CommentQueryRepository } from '../../../sql/comment.query.repository';
import { PostRepository } from '../../../sql/post.repository';

/**Блоггер может запросить все комментарии своих постов
 */
export class GetCommentsWithPostInfoByUserIdCommand {
  constructor(public userId: string, public query: PaginationQuery) {}
}

@CommandHandler(GetCommentsWithPostInfoByUserIdCommand)
export class GetCommentsWithPostInfoByUserIdCase
  implements ICommandHandler<GetCommentsWithPostInfoByUserIdCommand>
{
  constructor(
    private readonly postRepository: PostRepository,
    private readonly commentQueryRepository: CommentQueryRepository,
    private readonly likeCommentRepository: LikeCommentRepository,
  ) {}

  async execute(command: GetCommentsWithPostInfoByUserIdCommand) {
    const postsFromDb: Post[] = await this.postRepository.findPostsByUserId(
      command.userId,
    );

    const commentsFromDbWithPagination: PaginatorEnd & {
      items: Array<Comment>;
    } = await this.commentQueryRepository.getCommentsByPostsId(
      command.query,
      postsFromDb.map((p) => p.id),
    );

    const likesCommentsFromDb: Array<CommentLikes> =
      await this.likeCommentRepository.findLikesForComments(
        commentsFromDbWithPagination.items,
      );

    const result: PaginatorCommentWithWithPostInfoViewModel = {
      ...commentsFromDbWithPagination,
      items: commentsFromDbWithPagination.items.map((c) =>
        getCommentWithPostInfoViewModel(
          c,
          likesCommentsFromDb,
          postsFromDb,
          command.userId,
        ),
      ),
    };
    return result;
  }
}
