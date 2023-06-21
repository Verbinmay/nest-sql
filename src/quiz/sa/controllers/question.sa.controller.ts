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
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';

import { BasicAuthGuard } from '../../../guard/auth-passport/guard-passport/basic-auth.guard';
import { makeAnswerInController } from '../../../helpers/errors';
import { PaginationQuery } from '../../../pagination/base-pagination';
import { CreateQuestionDto as CreateQuestionDto } from '../dto/create-question.dto';
import { SA_CreateQuestionCommand } from '../use-cases/sa-create-question-case';
import { SA_DeleteQuestionCommand } from '../use-cases/sa-delete-question-case copy';
import { SA_GetQuestionCommands } from '../use-cases/sa-get-question-case';

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

  // @UseGuards(BasicAuthGuard)
  // @Put(':id/ban')
  // @HttpCode(204)
  // async banBlogById(
  //   @Param('id') blogId: string,
  //   @Body() inputModel: SABanBlogDto,
  // ) {
  //   const result = await this.commandBus.execute(
  //     new SA_BanBlogCommand(blogId, inputModel),
  //   );
  //   return makeAnswerInController(result);
  // }
}
