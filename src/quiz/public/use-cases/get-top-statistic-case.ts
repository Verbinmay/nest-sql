import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { PaginationQuery } from '../../../pagination/base-pagination';
import { PaginatorUserStatistic } from '../../../pagination/paginatorType';
import { UserRepository } from '../../../sql/user.repository';
import { PairRepository } from '../../repositories/pair.quiz.repository';

export class GetTopUsersCommand {
  constructor(public query: PaginationQuery) {}
}

@CommandHandler(GetTopUsersCommand)
export class GetTopUsersCase implements ICommandHandler<GetTopUsersCommand> {
  constructor(private readonly pairRepository: PairRepository) {}

  async execute(command: GetTopUsersCommand) {
    const users: PaginatorUserStatistic =
      await this.pairRepository.findStaticUsers(command.query);
    return users;
  }
}
