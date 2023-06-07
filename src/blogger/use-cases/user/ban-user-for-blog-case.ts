import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { BanedUser } from '../../../entities/sql/blogsBannedUsers.entity';
import { BanedUsersBlogsRepository } from '../../../sql/blog.banUsers.repository';
import { BlogRepository } from '../../../sql/blog.repository';
import { UserRepository } from '../../../sql/user.repository';
import { BanUserForBlogDto } from '../../dto/blog/ban-user-for-blog.dto';

/**Блоггер может банить пользователя для конкретного (своего) блога. Забаненный пользователь не может оставлять комментарии к постам блога, для которого он забанен */

export class BanUserForBlogByUserIdCommand {
  constructor(
    public userId: string,
    public userIdBlock: string,
    public inputModel: BanUserForBlogDto,
  ) {}
}

@CommandHandler(BanUserForBlogByUserIdCommand)
export class BanUserForBlogByUserIdCase
  implements ICommandHandler<BanUserForBlogByUserIdCommand>
{
  constructor(
    private readonly blogRepository: BlogRepository,
    private readonly userRepository: UserRepository,
    private readonly banedUsersBlogsRepository: BanedUsersBlogsRepository,
  ) {}

  async execute(command: BanUserForBlogByUserIdCommand) {
    const blog = await this.blogRepository.findBlogById(
      command.inputModel.blogId,
    );
    if (!blog) return { s: 404 };
    if (blog.userId !== command.userId) return { s: 403 };

    const userBan = await this.userRepository.findUserById(command.userIdBlock);
    if (!userBan) return { s: 404 };
    if (command.inputModel.isBanned === true) {
      const userBanInfo = new BanedUser();

      userBanInfo.userId = userBan.id;
      userBanInfo.userLogin = userBan.login;
      userBanInfo.banReason = command.inputModel.banReason;
      userBanInfo.blogId = blog.id;

      return await this.banedUsersBlogsRepository.create(userBanInfo);
    } else {
      const userIsBaned =
        await this.banedUsersBlogsRepository.findBanedUserByBlogId(blog.id);
      if (userIsBaned != null) {
        const userDeleted =
          await this.banedUsersBlogsRepository.deleteBanedUserByBlogId(blog.id);
        if (!(userDeleted.affected > 0)) {
          return { s: 500 };
        }
        return true;
      }
      return true;
    }
  }
}
