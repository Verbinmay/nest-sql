import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { Question } from '../../entities/question.entity';
import { QuestionRepository } from '../../repositories/question.quiz.repository';
import { UpdateQuestionDto } from '../dto/update-question.dto';

export class SA_UpdateQuestionCommand {
  constructor(
    public questionId: string,
    public inputModel: UpdateQuestionDto,
  ) {}
}

@CommandHandler(SA_UpdateQuestionCommand)
export class SA_UpdateQuestionCase
  implements ICommandHandler<SA_UpdateQuestionCommand>
{
  constructor(private readonly questionRepository: QuestionRepository) {}

  async execute(command: SA_UpdateQuestionCommand) {
    const question: Question = await this.questionRepository.findQuestionById(
      command.questionId,
    );
    if (!question) return { s: 404 };

    question.body = command.inputModel.body;
    question.answers = command.inputModel.correctAnswers;

    const updatedQuestion: Question = await this.questionRepository.update(
      question,
    );

    if (!updatedQuestion) {
      return { s: 500 };
    }
    return true;
  }
}
