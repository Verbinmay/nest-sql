import {
  Question,
  SA_GetQuestionViewModel,
} from '../../entities/question.entity';
import {
  GetNoPairViewModel,
  GetPairViewModel,
  Pair,
} from '../../entities/pairs.entity';
import { DataSource } from 'typeorm';

import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectDataSource } from '@nestjs/typeorm';

import { User } from '../../../entities/sql/user.entity';
import { UserRepository } from '../../../sql/user.repository';
import { PairRepository } from '../../repositories/pair.quiz.repository';
import { QuestionRepository } from '../../repositories/question.quiz.repository';

export class CreateConnectionCommand {
  constructor(public userId: string) {}
}
/**сначала ищем, если да-подключаем, если нет - создаем новое окно возможностей */

//TODO TRANSACTION

@CommandHandler(CreateConnectionCommand)
export class CreateConnectionCase
  implements ICommandHandler<CreateConnectionCommand>
{
  constructor(
    private readonly pairRepository: PairRepository,
    private readonly userRepository: UserRepository,
    private readonly questionRepository: QuestionRepository,
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  async execute(command: CreateConnectionCommand) {
    const user: User | null = await this.userRepository.findUserById(
      command.userId,
    );
    if (!user) return { s: 404 };

    const activePairCheck: Pair | null =
      await this.pairRepository.findActivePair(user.id);

    if (activePairCheck) return { s: 403 };

    const pair: Pair | null = await this.pairRepository.findFreePair();

    if (!pair) {
      const questions: Array<Question> =
        await this.questionRepository.findRandomQuestions();

      const newPair = new Pair();
      newPair.users = [user];
      newPair.f_id = user.id;
      newPair.questions = questions;

      const savedNewPair = await this.pairRepository.create(newPair);

      return GetNoPairViewModel(savedNewPair);
    } else {
      pair.users.push(user);
      pair.s_id = user.id;

      const updatedPair: Pair = await this.pairRepository.update(pair);

      return GetPairViewModel(updatedPair);
    }
  }
}
