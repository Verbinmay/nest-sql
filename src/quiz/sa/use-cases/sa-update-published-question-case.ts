import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { Question } from '../../entities/question.entity';
import { QuestionRepository } from '../../repositories/question.quiz.repository';
import { UpdatePublishedDto } from '../dto/update-published-question.dto';

export class SA_UpdatePublishQuestionCommand {
  constructor(
    public questionId: string,
    public inputModel: UpdatePublishedDto,
  ) {}
}

@CommandHandler(SA_UpdatePublishQuestionCommand)
export class SA_UpdatePublishQuestionCase
  implements ICommandHandler<SA_UpdatePublishQuestionCommand>
{
  constructor(private readonly questionRepository: QuestionRepository) {}

  async execute(command: SA_UpdatePublishQuestionCommand) {
    const question: Question = await this.questionRepository.findQuestionById(
      command.questionId,
    );
    if (!question) return { s: 404 };

    question.published = command.inputModel.published;

    const updatedQuestion: Question = await this.questionRepository.update(
      question,
    );

    if (!updatedQuestion) {
      return { s: 500 };
    }
    return true;
  }
}
