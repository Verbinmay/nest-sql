import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { CreateQuestionDto } from '../dto/create-question.dto';
import { Question, SA_GetQuestionViewModel } from '../entities/question.entity';
import { QuestionRepository } from '../repositories/blog.repository';

export class SA_CreateQuestionCommand {
  constructor(public inputModel: CreateQuestionDto) {}
}

@CommandHandler(SA_CreateQuestionCommand)
export class SA_CreateQuestionCase
  implements ICommandHandler<SA_CreateQuestionCommand>
{
  constructor(private readonly questionRepository: QuestionRepository) {}

  async execute(command: SA_CreateQuestionCommand) {
    const question: Question = new Question();
    question.body = command.inputModel.body;
    question.answers = command.inputModel.correctAnswers;

    const result: Question = await this.questionRepository.create(question);

    return SA_GetQuestionViewModel(result);
  }
}
