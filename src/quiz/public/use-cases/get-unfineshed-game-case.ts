import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { User } from '../../../entities/sql/user.entity';
import { UserRepository } from '../../../sql/user.repository';
import {
  GetNoPairViewModel,
  GetPairViewModel,
  Pair,
} from '../../entities/pairs.entity';
import {} from '../../entities/question.entity';
import { PairRepository } from '../../repositories/pair.quiz.repository';

export class GetUnfinishedGameCommand {
  constructor(public userId: string) {}
}

@CommandHandler(GetUnfinishedGameCommand)
export class GetUnfinishedGameCase
  implements ICommandHandler<GetUnfinishedGameCommand>
{
  constructor(
    private readonly pairRepository: PairRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async execute(command: GetUnfinishedGameCommand) {
    const user: User | null = await this.userRepository.findUserById(
      command.userId,
    );

    if (!user) return { s: 404 };

    const activePairCheck: Pair | null =
      await this.pairRepository.findMyCurrentGame(user.id);

    if (activePairCheck) {
      if (activePairCheck.startGameDate != null) {
        return GetPairViewModel(activePairCheck);
      } else {
        return GetNoPairViewModel(activePairCheck);
      }
    }

    return { s: 404 };
  }
}
