import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { User } from '../../../entities/sql/user.entity';
import { PaginationQuery } from '../../../pagination/base-pagination';
import { PaginatorUserStatistic } from '../../../pagination/paginatorType';
import { UserRepository } from '../../../sql/user.repository';
import { Pair } from '../../entities/pairs.entity';
import { PairRepository } from '../../repositories/pair.quiz.repository';
import { UserStatisticDTO } from '../dto/view-user-statistic.dto';

export class GetTopUsersCommand {
  constructor(public query: PaginationQuery) {}
}

@CommandHandler(GetTopUsersCommand)
export class GetTopUsersCase implements ICommandHandler<GetTopUsersCommand> {
  constructor(
    private readonly pairRepository: PairRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async execute(command: GetTopUsersCommand) {
    const users: PaginatorUserStatistic =
      await this.pairRepository.findStaticUsers(command.query);
    return users;
  }
}
