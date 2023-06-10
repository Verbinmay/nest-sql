import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { getCommentViewModel } from '../../../entities/sql/comment.entity';
import { LikeCommentRepository } from '../../../sql/comment.like.repository';
import { CommentRepository } from '../../../sql/comment.repository';

export class GetCommentByCommentIdCommand {
  constructor(public id: string, public userId: string) {}
}

@CommandHandler(GetCommentByCommentIdCommand)
export class GetCommentByCommentIdCase
  implements ICommandHandler<GetCommentByCommentIdCommand>
{
  constructor(
    private readonly commentRepository: CommentRepository,
    private readonly likeCommentRepository: LikeCommentRepository,
  ) {}

  async execute(command: GetCommentByCommentIdCommand) {
    const comment = await this.commentRepository.findById(command.id);
    if (!comment || comment.isBanned === true) {
      return { s: 404 };
    }
    const likes = await this.likeCommentRepository.findLikesForComments([
      comment,
    ]);

    return getCommentViewModel(comment, likes, command.userId);
  }
}
