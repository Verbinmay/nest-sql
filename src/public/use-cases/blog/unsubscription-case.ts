import { log } from 'console';

import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { Blog } from '../../../entities/sql/blog.entity';
import { BanedUser } from '../../../entities/sql/blogsBannedUsers.entity';
import { User } from '../../../entities/sql/user.entity';
import { BanedUsersBlogsRepository } from '../../../sql/blog.banUsers.repository';
import { BlogRepository } from '../../../sql/blog.repository';
import { FollowerRepository } from '../../../sql/followers.repository';
import { UserRepository } from '../../../sql/user.repository';

export class DeleteSubscriptionOnBlogCommand {
  constructor(public userId: string, public blogId: string) {}
}

@CommandHandler(DeleteSubscriptionOnBlogCommand)
export class DeleteSubscriptionOnBlogCase
  implements ICommandHandler<DeleteSubscriptionOnBlogCommand>
{
  constructor(
    private readonly blogRepository: BlogRepository,
    private readonly userRepository: UserRepository,
    private readonly banedUsersBlogsRepository: BanedUsersBlogsRepository,
    private readonly followerRepository: FollowerRepository,
  ) {}

  async execute(command: DeleteSubscriptionOnBlogCommand) {
    const blog: Blog | null = await this.blogRepository.findBlogById(
      command.blogId,
    );
    if (!blog) {
      return { s: 404 };
    }

    const user: User | null = await this.userRepository.findUserById(
      command.userId,
    );
    if (!user) {
      return { s: 404 };
    }

    /**Проверка на забаненность  */
    const blogsBan: BanedUser | null =
      await this.banedUsersBlogsRepository.findBanedUsersByBlogId(
        user.id,
        blog.id,
      );
    if (blogsBan) {
      return { s: 403 };
    }
    const followForm = await this.followerRepository.findByUserIdAndBlogId(
      user.id,
      blog.id,
    );
    followForm.status = 'Unsubscribed';
    await this.followerRepository.update(followForm);
    return;
  }
}
