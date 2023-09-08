import { CronJob } from 'cron';

import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { Answer, GetAnswerViewModel } from '../../entities/answer.entity';
import { Pair } from '../../entities/pairs.entity';
import { Question } from '../../entities/question.entity';
import { AnswerRepository } from '../../repositories/answer.quiz.repository';
import { PairRepository } from '../../repositories/pair.quiz.repository';
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

    const question: Question = activePairCheck.questions.sort(
      (a, b) => +a.createdAt - +b.createdAt,
    )[checkAnswer];

    const newAnswer = new Answer();
    newAnswer.userId = command.userId;
    newAnswer.questionId = question.id;
    newAnswer.answerStatus = question.answers.includes(
      command.inputModel.answer,
    )
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

    // if (activePairCheck.answers.length === 9) {
    //   if (
    //     command.userId === activePairCheck.f_id &&
    //     activePairCheck.s_score != 0
    //   ) {
    //     activePairCheck.s_score = activePairCheck.s_score + 1;
    //   } else if (
    //     command.userId === activePairCheck.s_id &&
    //     activePairCheck.f_score != 0
    //   ) {
    //     activePairCheck.f_score = activePairCheck.f_score + 1;
    //   }

    //   activePairCheck.finishGameDate = savedAnswer.addedAt;
    //   activePairCheck.status = 'Finished';
    // }
    activePairCheck.answers.push(savedAnswer);
    if (
      activePairCheck.answers.filter((a) => a.userId === command.userId)
        .length === 5 &&
      activePairCheck.answers.filter((a) => a.userId !== command.userId)
        .length !== 5
    ) {
      const date = new Date();
      date.setSeconds(date.getSeconds() + 10);
      const job = new CronJob(date, async () => {
        const pair = await this.pairRepository.findGameById(activePairCheck.id);
        if (command.userId === pair.f_id && pair.f_score != 0) {
          pair.f_score = pair.f_score + 1;
        } else if (command.userId === pair.s_id && pair.s_score != 0) {
          pair.s_score = pair.s_score + 1;
        }

        pair.finishGameDate = pair.answers.reduce((maxItem, currentItem) => {
          if (currentItem.addedAt > maxItem.addedAt) {
            return currentItem;
          } else {
            return maxItem;
          }
        }, pair.answers[0]).addedAt;
        pair.status = 'Finished';
        await this.pairRepository.update(pair);
      });
      job.start();
    }
    await this.pairRepository.update(activePairCheck);

    return GetAnswerViewModel(savedAnswer);
  }
}
