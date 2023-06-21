import { PaginatorCommentWithWithPostInfoViewModel } from '../../../pagination/paginatorType';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

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

    const result: PaginatorCommentWithWithPostInfoViewModel =
      await this.commentQueryRepository.getCommentsWithPostInfoByPostsId(
        command.query,
        postsFromDb.map((p) => p.id),
        command.userId,
      );

    return result;
  }
}
