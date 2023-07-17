import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { User } from '../../../entities/sql/user.entity';
import { UserRepository } from '../../../sql/user.repository';
import { Pair } from '../../entities/pairs.entity';
import { PairRepository } from '../../repositories/pair.quiz.repository';

export class GetMyStatisticCommand {
  constructor(public userId: string) {}
}

@CommandHandler(GetMyStatisticCommand)
export class GetMyStatisticCase
  implements ICommandHandler<GetMyStatisticCommand>
{
  constructor(
    private readonly pairRepository: PairRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async execute(command: GetMyStatisticCommand) {
    //user check
    const user: User | null = await this.userRepository.findUserById(
      command.userId,
    );
    if (!user) return { s: 404 };

    const pairs: Array<Pair> = await this.pairRepository.findAllRawPairsById(
      user.id,
    );

    const sumScore: number = pairs
      .map((p) => {
        if (p.f_id === user.id) return p.f_score;
        if (p.s_id === user.id) return p.s_score;
      })
      .reduce((totalSum, num) => {
        totalSum += num;
        return totalSum;
      }, 0);

    const gamesCount: number = pairs.length;

    const avgScores: number = Math.round((sumScore / gamesCount) * 100) / 100;

    const winsCount: number = pairs.filter(function (p) {
      return p.f_id === user.id ? p.f_score > p.s_score : p.s_score > p.f_score;
    }).length;

    const lossesCount: number = pairs.filter(function (p) {
      return p.f_id === user.id ? p.s_score > p.f_score : p.f_score > p.s_score;
    }).length;

    const drawsCount: number = gamesCount - winsCount - lossesCount;

    return {
      sumScore: sumScore,
      avgScores: avgScores,
      gamesCount: gamesCount,
      winsCount: winsCount,
      lossesCount: lossesCount,
      drawsCount: drawsCount,
    };
  }
}
