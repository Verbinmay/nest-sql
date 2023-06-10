import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { Comment } from '../../../entities/sql/comment.entity';
import { CommentRepository } from '../../../sql/comment.repository';
import { UpdateCommentDto } from '../../dto/comment/update-comment.dto';

export class UpdateCommentCommand {
  constructor(
    public commentId: string,
    public userId: string,
    public inputModel: UpdateCommentDto,
  ) {}
}

@CommandHandler(UpdateCommentCommand)
export class UpdateCommentCase
  implements ICommandHandler<UpdateCommentCommand>
{
  constructor(private readonly commentRepository: CommentRepository) {}

  async execute(command: UpdateCommentCommand) {
    const comment: Comment | null = await this.commentRepository.findById(
      command.commentId,
    );
    if (!comment) {
      return { s: 404 };
    }
    if (comment.userId !== command.userId) {
      return { s: 403 };
    }

    comment.content = command.inputModel.content;
    await this.commentRepository.update(comment);

    return true;
  }
}
