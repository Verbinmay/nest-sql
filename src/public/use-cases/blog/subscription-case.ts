import { log } from 'console';

import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { Blog } from '../../../entities/sql/blog.entity';
import { BanedUser } from '../../../entities/sql/blogsBannedUsers.entity';
import { User } from '../../../entities/sql/user.entity';
import { UserFollowBlog } from '../../../entities/sql/userFollowBlog.entity';
import { BanedUsersBlogsRepository } from '../../../sql/blog.banUsers.repository';
import { BlogRepository } from '../../../sql/blog.repository';
import { FollowerRepository } from '../../../sql/followers.repository';
import { UserRepository } from '../../../sql/user.repository';

export class PostSubscriptionOnBlogCommand {
  constructor(public userId: string, public blogId: string) {}
}

@CommandHandler(PostSubscriptionOnBlogCommand)
export class PostSubscriptionOnBlogCase
  implements ICommandHandler<PostSubscriptionOnBlogCommand>
{
  constructor(
    private readonly blogRepository: BlogRepository,
    private readonly userRepository: UserRepository,
    private readonly banedUsersBlogsRepository: BanedUsersBlogsRepository,
    private readonly followerRepository: FollowerRepository,
  ) {}

  async execute(command: PostSubscriptionOnBlogCommand) {
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
    const follower = new UserFollowBlog();
    follower.blogId = blog.id;
    follower.userId = user.id;
    follower.status = 'Subscribed';
    const follow = await this.followerRepository.create(follower);

    return;
  }
}
