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
import { Answer, GetAnswerViewModel } from '../../entities/answer.entity';
import { AnswerRepository } from '../../repositories/answer.quiz.repository';
import { PairRepository } from '../../repositories/pair.quiz.repository';
import { QuestionRepository } from '../../repositories/question.quiz.repository';
import { CreateAnswerDto } from '../dto/create-answer.dto';

export class CreateAnswerCommand {
  constructor(public userId: string, public inputModel: CreateAnswerDto) {}
}

@CommandHandler(CreateAnswerCommand)
export class CreateAnswerCase implements ICommandHandler<CreateAnswerCommand> {
  constructor(
    private readonly pairRepository: PairRepository,
    private readonly answerRepository: AnswerRepository,
  ) {}

  async execute(command: CreateAnswerCommand) {
    const activePairCheck: Pair | null =
      await this.pairRepository.findFullActivePair(command.userId);

    if (
      activePairCheck == null ||
      activePairCheck.answers.filter(function (a) {
        return a.userId === command.userId;
      }).length >= activePairCheck.questions.length
    )
      return { s: 403 };

    const checkAnswer = activePairCheck.answers.filter(function (a) {
      return a.userId === command.userId;
    }).length;

    const newAnswer = new Answer();
    newAnswer.userId = command.userId;
    newAnswer.questionId = activePairCheck.questions[checkAnswer].id;
    newAnswer.answerStatus = activePairCheck.questions[
      checkAnswer
    ].answers.includes(command.inputModel.answer)
      ? 'Correct'
      : 'Incorrect';
    newAnswer.pair = activePairCheck;

    const savedAnswer: Answer = await this.answerRepository.create(newAnswer);

    if (newAnswer.answerStatus === 'Correct') {
      if (command.userId === activePairCheck.f_id) {
        activePairCheck.f_score = activePairCheck.f_score + 1;
      } else {
        activePairCheck.s_score = activePairCheck.s_score + 1;
      }
    }

    if (activePairCheck.answers.length === 9) {
      if (
        command.userId === activePairCheck.f_id &&
        activePairCheck.s_score != 0
      ) {
        activePairCheck.s_score = activePairCheck.s_score + 1;
      } else if (
        command.userId === activePairCheck.s_id &&
        activePairCheck.f_score != 0
      ) {
        activePairCheck.f_score = activePairCheck.f_score + 1;
      }

      activePairCheck.finishGameDate = savedAnswer.addedAt;
      activePairCheck.status = 'Finished';
    }
    activePairCheck.answers.push(savedAnswer);
    const updatedPair = await this.pairRepository.update(activePairCheck);
    return GetAnswerViewModel(savedAnswer);
  }
}
