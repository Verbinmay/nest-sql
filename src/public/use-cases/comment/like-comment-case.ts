import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { Comment } from '../../../entities/sql/comment.entity';
import { CommentLike } from '../../../entities/sql/comment.like.entity';
import { LikeCommentRepository } from '../../../sql/comment.like.repository';
import { CommentRepository } from '../../../sql/comment.repository';
import { UserRepository } from '../../../sql/user.repository';
import { LikeDto } from '../../dto/likes/like.dto';

export class LikeCommentCommand {
  constructor(
    public commentId: string,
    public userId: string,
    public inputModel: LikeDto,
  ) {}
}

@CommandHandler(LikeCommentCommand)
export class LikeCommentCase implements ICommandHandler<LikeCommentCommand> {
  constructor(
    private readonly commentRepository: CommentRepository,
    private readonly userRepository: UserRepository,
    private readonly likeCommentRepository: LikeCommentRepository,
  ) {}

  async execute(command: LikeCommentCommand) {
    const comment: Comment | null = await this.commentRepository.findById(
      command.commentId,
    );

    if (!comment || comment.isBanned === true) {
      return { s: 404 };
    }

    const user = await this.userRepository.findUserById(command.userId);

    if (!user) {
      return { s: 404 };
    }
    const like: CommentLike = await this.likeCommentRepository.findLikeByUserId(
      user.id,
    );

    if (like) {
      if (like.status === command.inputModel.likeStatus) {
        return true;
      }
      if (command.inputModel.likeStatus === 'None') {
        await this.likeCommentRepository.delete(like.id);
        return true;
      }

      like.status = command.inputModel.likeStatus;
      await this.likeCommentRepository.update(like);
      return true;
    } else if (!like && command.inputModel.likeStatus !== 'None') {
      const newLike = new CommentLike();
      newLike.user = user;
      newLike.comment = comment;
      newLike.status = command.inputModel.likeStatus;
      await this.likeCommentRepository.create(newLike);
      return true;
    }
  }
}
