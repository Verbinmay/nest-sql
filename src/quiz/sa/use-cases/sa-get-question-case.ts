import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { PaginationQuery } from '../../../pagination/base-pagination';
import { PaginatorQuestion } from '../../../pagination/paginatorType';
import { QuestionRepository } from '../../repositories/question.quiz.repository';

export class SA_GetQuestionCommands {
  constructor(public query: PaginationQuery) {}
}

@CommandHandler(SA_GetQuestionCommands)
export class SA_GetQuestionCase
  implements ICommandHandler<SA_GetQuestionCommands>
{
  constructor(private readonly questionRepository: QuestionRepository) {}

  async execute(command: SA_GetQuestionCommands) {
    const result: PaginatorQuestion =
      await this.questionRepository.findQuestions(command.query);

    return result;
  }
}
