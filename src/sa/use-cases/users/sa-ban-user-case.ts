import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { LikeCommentRepository } from '../../../sql/comment.like.repository';
import { CommentRepository } from '../../../sql/comment.repository';
import { LikePostRepository } from '../../../sql/post.like.repository';
import { PostRepository } from '../../../sql/post.repository';
import { SessionRepository } from '../../../sql/sessions.repository';
import { UserRepository } from '../../../sql/user.repository';
import { BanDto } from '../../dto/user/ban-user.dto copy';

export class SA_BanUserCommand {
  constructor(public userId: string, public inputModel: BanDto) {}
}

@CommandHandler(SA_BanUserCommand)
export class SA_BanUserCase implements ICommandHandler<SA_BanUserCommand> {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly sessionRepository: SessionRepository,
    private readonly postRepository: PostRepository,
    private readonly likePostRepository: LikePostRepository,
    private readonly commentRepository: CommentRepository,
    private readonly likeCommentRepository: LikeCommentRepository,
  ) {}

  async execute(command: SA_BanUserCommand) {
    const user = await this.userRepository.findUserById(command.userId);
    if (!user) {
      return { s: 404 };
    }

    if (user.isBanned === command.inputModel.isBanned) return true;

    user.isBanned = command.inputModel.isBanned;
    user.banReason =
      command.inputModel.isBanned === true
        ? command.inputModel.banReason
        : null;
    user.banDate = command.inputModel.isBanned === true ? new Date() : null;

    await this.userRepository.update(user);

    if (command.inputModel.isBanned === true) {
      await this.sessionRepository.deleteAll(command.userId);
    }
    await this.postRepository.banPostByUserId(
      command.userId,
      command.inputModel.isBanned,
    );
    await this.likePostRepository.banLikePostByUserId(
      command.userId,
      command.inputModel.isBanned,
    );

    await this.commentRepository.banCommentByUserId(
      command.userId,
      command.inputModel.isBanned,
    );

    await this.likeCommentRepository.banLikeCommentByUserId(
      command.userId,
      command.inputModel.isBanned,
    );
    return true;
  }
}
