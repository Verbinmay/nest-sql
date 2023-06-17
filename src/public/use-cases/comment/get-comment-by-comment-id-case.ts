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

    return getCommentViewModel(comment, command.userId);
  }
}
