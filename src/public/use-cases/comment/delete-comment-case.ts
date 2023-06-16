import { CommandHandler } from '@nestjs/cqrs';
import { ICommandHandler } from '@nestjs/cqrs';

import { Comment } from '../../../entities/sql/comment.entity';
import { CommentRepository } from '../../../sql/comment.repository';

export class DeleteCommentCommand {
  constructor(public commentId: string, public userId: string) {}
}

@CommandHandler(DeleteCommentCommand)
export class DeleteCommentCase
  implements ICommandHandler<DeleteCommentCommand>
{
  constructor(private readonly commentRepository: CommentRepository) {}

  async execute(command: DeleteCommentCommand) {
    const comment: Comment | null = await this.commentRepository.findById(
      command.commentId,
    );
    if (!comment) {
      return { s: 404 };
    }

    if (comment.user.id !== command.userId) {
      return { s: 403 };
    }

    const commentDelete = await this.commentRepository.delete(comment.id);

    if (!(commentDelete.affected > 0)) {
      return { s: 500 };
    }
    return true;
  }
}
