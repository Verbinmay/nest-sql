import {
  GetNoPairViewModel,
  GetPairViewModel,
  Pair,
} from '../../entities/pairs.entity';
import { DataSource, EntityManager } from 'typeorm';

import { CommandHandler } from '@nestjs/cqrs';
import { InjectDataSource } from '@nestjs/typeorm';

import { User } from '../../../entities/sql/user.entity';
import { UserRepository } from '../../../sql/user.repository';
import { Question } from '../../entities/question.entity';
import { PairRepository } from '../../repositories/pair.quiz.repository';
import { QuestionRepository } from '../../repositories/question.quiz.repository';
import { TransactionBaseUseCase } from '../../transaction/transaction.case';

export class CreateConnectionCommand {
  constructor(public userId: string) {}
}
/**сначала ищем, если да-подключаем, если нет - создаем новое окно возможностей */

//TODO TRANSACTION

@CommandHandler(CreateConnectionCommand)
export class CreateConnectionCase extends TransactionBaseUseCase<
  CreateConnectionCommand,
  any
> {
  constructor(
    private readonly pairRepository: PairRepository,
    private readonly userRepository: UserRepository,
    private readonly questionRepository: QuestionRepository,
    @InjectDataSource()
    protected readonly dataSource: DataSource,
  ) {
    super(dataSource);
  }
  async doLogic(command: CreateConnectionCommand, manager: EntityManager) {
    //user check
    const user: User | null = await this.userRepository.findUserById(
      command.userId,
    );
    if (!user) return { s: 404 };

    //active pair check
    const activePairCheck: Pair | null =
      await this.pairRepository.findActivePair(user.id);
    if (activePairCheck) return { s: 403 };

    //create question and check
    const questions: Array<Question> =
      await this.questionRepository.findRandomQuestions();

    //TODO не могу пройти тесты, если ставлю ошибку 400 втф
    if (questions.length < 5) return { s: 404 };

    const pair: Pair | null = await this.pairRepository.findFreePair(manager);

    if (!pair) {
      const newPair = new Pair();

      newPair.users = [user];
      newPair.f_id = user.id;
      newPair.questions = questions;
      const savedNewPair = await this.pairRepository.create(newPair, manager);

      return GetNoPairViewModel(savedNewPair);
    } else {
      //check pair current user
      // if (pair.f_id === user.id) return GetNoPairViewModel(pair);
      if (pair.f_id === user.id) return { s: 403 };

      pair.users.push(user);
      pair.s_id = user.id;
      pair.status = 'Active';
      pair.startGameDate = new Date();

      const updatedPair: Pair = await this.pairRepository.update(pair, manager);

      return GetPairViewModel(updatedPair);
    }
  }
  public async execute(command: CreateConnectionCommand) {
    return super.execute(command);
  }
}
