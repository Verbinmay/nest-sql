import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { Question } from '../entities/question.entity';
import { QuestionRepository } from '../repositories/question.quiz.repository';

export class SA_DeleteQuestionCommand {
  constructor(public questionId: string) {}
}

@CommandHandler(SA_DeleteQuestionCommand)
export class SA_DeleteQuestionCase
  implements ICommandHandler<SA_DeleteQuestionCommand>
{
  constructor(private readonly questionRepository: QuestionRepository) {}

  async execute(command: SA_DeleteQuestionCommand) {
    const question: Question = await this.questionRepository.findQuestionById(
      command.questionId,
    );
    if (!question) return { s: 404 };

    const deletedQuestion: boolean = await this.questionRepository.delete(
      question.id,
    );

    if (deletedQuestion === false) {
      return { s: 500 };
    }
    return deletedQuestion;
  }
}
