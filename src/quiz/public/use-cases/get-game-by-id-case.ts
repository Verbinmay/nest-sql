import {
  GetNoPairViewModel,
  GetPairViewModel,
  Pair,
} from '../../entities/pairs.entity';
import { isUUID } from 'class-validator';

import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { User } from '../../../entities/sql/user.entity';
import { errorMaker } from '../../../helpers/errors';
import { UserRepository } from '../../../sql/user.repository';
import {} from '../../entities/question.entity';
import { PairRepository } from '../../repositories/pair.quiz.repository';

export class GetGameByIdCommand {
  constructor(public id: string, public userId: string) {}
}

@CommandHandler(GetGameByIdCommand)
export class GetGameByIdCase implements ICommandHandler<GetGameByIdCommand> {
  constructor(
    private readonly pairRepository: PairRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async execute(command: GetGameByIdCommand) {
    //user check
    const user: User | null = await this.userRepository.findUserById(
      command.userId,
    );
    if (!user) return { s: 404 };

    const activePairCheck: Pair | null = await this.pairRepository.findGameById(
      command.id,
    );

    if (activePairCheck) {
      //check user in game
      if (activePairCheck.f_id !== user.id && activePairCheck.s_id !== user.id)
        return { s: 403 };

      if (activePairCheck.startGameDate != null) {
        return GetPairViewModel(activePairCheck);
      } else {
        return GetNoPairViewModel(activePairCheck);
      }
    }
    //TODO game id check
    if (!isUUID(command.id) && !activePairCheck)
      return { s: 400, mf: errorMaker(['Is incorrect id', 'id']) };
    return { s: 404 };
  }
}
