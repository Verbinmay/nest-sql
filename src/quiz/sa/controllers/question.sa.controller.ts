import {
  Controller,
  Get,
  Param,
  Query,
  HttpCode,
  UseGuards,
  Body,
  Post,
  Delete,
  Put,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';

import { BasicAuthGuard } from '../../../guard/auth-passport/guard-passport/basic-auth.guard';
import { makeAnswerInController } from '../../../helpers/errors';
import { PaginationQuery } from '../../../pagination/base-pagination';
import { CreateQuestionDto as CreateQuestionDto } from '../dto/create-question.dto';
import { UpdatePublishedDto } from '../dto/update-published-question.dto';
import { UpdateQuestionDto } from '../dto/update-question.dto';
import { SA_CreateQuestionCommand } from '../use-cases/sa-create-question-case';
import { SA_DeleteQuestionCommand } from '../use-cases/sa-delete-question-case';
import { SA_GetQuestionCommands } from '../use-cases/sa-get-question-case';
import { SA_UpdatePublishQuestionCommand } from '../use-cases/sa-update-published-question-case';
import { SA_UpdateQuestionCommand } from '../use-cases/sa-update-question-case';

@Controller('sa/quiz/questions')
export class QuestionSAController {
  constructor(private commandBus: CommandBus) {}

  @UseGuards(BasicAuthGuard)
  @Post()
  async SA_CreateQuestion(@Body() inputModel: CreateQuestionDto) {
    const result = await this.commandBus.execute(
      new SA_CreateQuestionCommand(inputModel),
    );
    return makeAnswerInController(result);
  }

  @UseGuards(BasicAuthGuard)
  @Get()
  async SA_GetQuestion(@Query() query: PaginationQuery) {
    const result = await this.commandBus.execute(
      new SA_GetQuestionCommands(query),
    );
    return makeAnswerInController(result);
  }

  @UseGuards(BasicAuthGuard)
  @Delete(':id')
  @HttpCode(204)
  async SA_DeleteQuestion(@Param('id') questionId: string) {
    const result = await this.commandBus.execute(
      new SA_DeleteQuestionCommand(questionId),
    );
    return makeAnswerInController(result);
  }

  @UseGuards(BasicAuthGuard)
  @Put(':id')
  @HttpCode(204)
  async SA_UpdateQuestion(
    @Param('id') questionId: string,
    @Body() inputModel: UpdateQuestionDto,
  ) {
    const result = await this.commandBus.execute(
      new SA_UpdateQuestionCommand(questionId, inputModel),
    );
    return makeAnswerInController(result);
  }

  @UseGuards(BasicAuthGuard)
  @Put(':id/publish')
  @HttpCode(204)
  async SA_UpdatePublishQuestion(
    @Param('id') questionId: string,
    @Body() inputModel: UpdatePublishedDto,
  ) {
    const result = await this.commandBus.execute(
      new SA_UpdatePublishQuestionCommand(questionId, inputModel),
    );
    return makeAnswerInController(result);
  }
}
