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

import { JwtAuthGuard } from '../../../guard/auth-passport/guard-passport/jwt-auth.guard';
import { CurrentPayload } from '../../../decorator/currentUser.decorator';
import { makeAnswerInController } from '../../../helpers/errors';
import { CreateConnectionCommand } from '../use-cases/create-connection-case';

@Controller('pair-game-quiz/pairs')
export class QuestionSAController {
  constructor(private commandBus: CommandBus) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async createConnection(@CurrentPayload() payload) {
    const userId = payload ? payload.sub : '';
    const result = await this.commandBus.execute(
      new CreateConnectionCommand(userId),
    );
    return makeAnswerInController(result);
  }

  // @UseGuards(BasicAuthGuard)
  // @Post()
  // async SA_CreateQuestion(@Body() inputModel: CreateQuestionDto) {
  //   const result = await this.commandBus.execute(
  //     new SA_CreateQuestionCommand(inputModel),
  //   );
  //   return makeAnswerInController(result);
  // }

  // @UseGuards(BasicAuthGuard)
  // @Get()
  // async SA_GetQuestion(@Query() query: PaginationQuery) {
  //   const result = await this.commandBus.execute(
  //     new SA_GetQuestionCommands(query),
  //   );
  //   return makeAnswerInController(result);
  // }

  // @UseGuards(BasicAuthGuard)
  // @Delete(':id')
  // @HttpCode(204)
  // async SA_DeleteQuestion(@Param('id') questionId: string) {
  //   const result = await this.commandBus.execute(
  //     new SA_DeleteQuestionCommand(questionId),
  //   );
  //   return makeAnswerInController(result);
  // }

  // @UseGuards(BasicAuthGuard)
  // @Put(':id')
  // @HttpCode(204)
  // async SA_UpdateQuestion(
  //   @Param('id') questionId: string,
  //   @Body() inputModel: UpdateQuestionDto,
  // ) {
  //   const result = await this.commandBus.execute(
  //     new SA_UpdateQuestionCommand(questionId, inputModel),
  //   );
  //   return makeAnswerInController(result);
  // }

  // @UseGuards(BasicAuthGuard)
  // @Put(':id/publish')
  // @HttpCode(204)
  // async SA_UpdatePublishQuestion(
  //   @Param('id') questionId: string,
  //   @Body() inputModel: UpdatePublishedDto,
  // ) {
  //   const result = await this.commandBus.execute(
  //     new SA_UpdatePublishQuestionCommand(questionId, inputModel),
  //   );
  //   return makeAnswerInController(result);
  // }
}
