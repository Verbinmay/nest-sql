import {
  Question,
  SA_GetQuestionViewModel,
} from '../../entities/question.entity';
import {
  GetNoPairViewModel,
  GetPairViewModel,
  Pair,
} from '../../entities/pairs.entity';
import { error } from 'console';
import { DataSource, EntityManager, QueryRunner } from 'typeorm';

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

    const questions: Array<Question> =
      await this.questionRepository.findRandomQuestions();

    //TODO не могу пройти тесты, если ставлю ошибку 400 втф
    if (questions.length < 5) return { s: 404 };

    const queryRunner: QueryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    const queryRunnerManager: EntityManager = queryRunner.manager;

    try {
      const pair: Pair | null = await this.pairRepository.findFreePair(
        queryRunnerManager,
      );

      if (!pair) {
        const newPair = new Pair();

        newPair.users = [user];
        newPair.f_id = user.id;
        newPair.questions = questions;

        const savedNewPair = await this.pairRepository.create(
          newPair,
          queryRunnerManager,
        );

        // commit transaction now:
        await queryRunner.commitTransaction();

        return GetNoPairViewModel(savedNewPair);
      } else {
        if (pair.f_id === user.id) return GetNoPairViewModel(pair);

        pair.users.push(user);
        pair.s_id = user.id;
        pair.status = 'Active';
        pair.startGameDate = new Date();

        const updatedPair: Pair = await this.pairRepository.update(
          pair,
          queryRunnerManager,
        );

        // commit transaction now:

        await queryRunner.commitTransaction();
        return GetPairViewModel(updatedPair);
      }
    } catch (err) {
      // since we have errors let's rollback changes we made
      console.log('rollback');
      await queryRunner.rollbackTransaction();
    } finally {
      // you need to release query runner which is manually created:

      await queryRunner.release();
    }
  }
}
