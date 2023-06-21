import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { PaginationQuery } from '../../../pagination/base-pagination';
import { PaginatorUser } from '../../../pagination/paginatorType';
import { UserQueryRepository } from '../../../sql/user.query.repository';

export class SA_GetAllUsersCommand {
  constructor(public query: PaginationQuery) {}
}

@CommandHandler(SA_GetAllUsersCommand)
export class SA_GetAllUsersCase
  implements ICommandHandler<SA_GetAllUsersCommand>
{
  constructor(private readonly userQueryRepository: UserQueryRepository) {}

  async execute(command: SA_GetAllUsersCommand) {
    const result: PaginatorUser = await this.userQueryRepository.SA_findUsers(
      command.query,
    );

    return result;
  }
}
