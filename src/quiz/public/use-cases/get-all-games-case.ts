import { PaginatorPair } from '../../../pagination/paginatorType';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { PaginationQuery } from '../../../pagination/base-pagination';
import { PairRepository } from '../../repositories/pair.quiz.repository';

export class GetAllGamesCommand {
  constructor(public userId: string, public query: PaginationQuery) {}
}

@CommandHandler(GetAllGamesCommand)
export class GetAllGamesCase implements ICommandHandler<GetAllGamesCommand> {
  constructor(private readonly pairRepository: PairRepository) {}

  async execute(command: GetAllGamesCommand) {
    const result: PaginatorPair = await this.pairRepository.findPairs(
      command.userId,
      command.query,
    );

    return result;
  }
}
