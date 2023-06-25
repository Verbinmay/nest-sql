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
import { GetGameByIdCommand } from '../use-cases/get-game-by-id-case';
import { GetUnfinishedGameCommand } from '../use-cases/get-unfineshed-game-case';

@Controller('pair-game-quiz/pairs')
export class PairController {
  constructor(private commandBus: CommandBus) {}

  @UseGuards(JwtAuthGuard)
  @Post('connection')
  @HttpCode(200)
  async createConnection(@CurrentPayload() payload) {
    const userId = payload ? payload.sub : '';
    const result = await this.commandBus.execute(
      new CreateConnectionCommand(userId),
    );
    return makeAnswerInController(result);
  }

  @UseGuards(JwtAuthGuard)
  @Get('my-current')
  async findUnfinishedGame(@CurrentPayload() payload) {
    const userId = payload ? payload.sub : '';
    const result = await this.commandBus.execute(
      new GetUnfinishedGameCommand(userId),
    );
    return makeAnswerInController(result);
  }
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findGameById(@Param('id') gameId: string, @CurrentPayload() payload) {
    const userId = payload ? payload.sub : '';
    const result = await this.commandBus.execute(
      new GetGameByIdCommand(gameId, userId),
    );
    return makeAnswerInController(result);
  }

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
