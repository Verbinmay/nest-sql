import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { PostLike } from '../../../entities/sql/post.like.entity';
import { LikePostRepository } from '../../../sql/post.like.repository';
import { PostRepository } from '../../../sql/post.repository';
import { UserRepository } from '../../../sql/user.repository';
import { LikeDto } from '../../dto/likes/like.dto';

export class LikePostCommand {
  constructor(
    public postId: string,
    public userId: string,
    public inputModel: LikeDto,
  ) {}
}

@CommandHandler(LikePostCommand)
export class LikePostCase implements ICommandHandler<LikePostCommand> {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly userRepository: UserRepository,
    private readonly likePostRepository: LikePostRepository,
  ) {}

  async execute(command: LikePostCommand) {
    const post = await this.postRepository.findPostById(command.postId);

    if (!post || post.isBanned === true) {
      return { s: 404 };
    }

    const user = await this.userRepository.findUserById(command.userId);

    if (!user) {
      return { s: 404 };
    }
    const like: PostLike = await this.likePostRepository.findLikeByUserId(
      user.id,
    );

    if (like) {
      if (like.status === command.inputModel.likeStatus) {
        return true;
      }
      if (command.inputModel.likeStatus === 'None') {
        await this.likePostRepository.delete(like.id);
        return true;
      }

      like.status = command.inputModel.likeStatus;
      await this.likePostRepository.update(like);
      return true;
    } else if (!like && command.inputModel.likeStatus !== 'None') {
      const newLike = new PostLike();
      newLike.user = user;
      newLike.post = post;
      newLike.status = command.inputModel.likeStatus;
      await this.likePostRepository.create(newLike);
      return true;
    }
  }
}
