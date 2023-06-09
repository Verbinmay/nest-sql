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
    if (blog.user.id !== command.userId) return { s: 403 };

    const userBan = await this.userRepository.findUserById(command.userIdBlock);
    if (!userBan) return { s: 404 };

    const userBanIsBaned =
      await this.banedUsersBlogsRepository.findBanedUsersByBlogId(
        userBan.id,
        blog.id,
      );

    if (userBanIsBaned && command.inputModel.isBanned === false) {
      await this.banedUsersBlogsRepository.deleteBanedUserByBlogId(
        userBan.id,
        blog.id,
      );
      return true;
    } else if (userBanIsBaned && command.inputModel.isBanned === true) {
      return true;
    } else if (!userBanIsBaned && command.inputModel.isBanned === true) {
      const newUserBanInfo = new BanedUser();

      newUserBanInfo.user = userBan;
      newUserBanInfo.banReason = command.inputModel.banReason;
      newUserBanInfo.blog = blog;

      await this.banedUsersBlogsRepository.create(newUserBanInfo);
      return true;
    } else {
      // return { s: 404 };
      return true;
    }
  }
}
