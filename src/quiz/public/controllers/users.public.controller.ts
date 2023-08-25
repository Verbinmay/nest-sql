import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';

import { JwtAuthGuard } from '../../../guard/auth-passport/guard-passport/jwt-auth.guard';
import { CurrentPayload } from '../../../decorator/currentUser.decorator';
import { makeAnswerInController } from '../../../helpers/errors';
import { PaginationQuery } from '../../../pagination/base-pagination';
import { GetMyStatisticCommand } from '../use-cases/get-my-statistic-case';
import { GetTopUsersCommand } from '../use-cases/get-top-statistic-case';

@Controller('pair-game-quiz/users')
export class UserPairController {
  constructor(private commandBus: CommandBus) {}

  @Get('top')
  async findTopUsers(@Query() query: PaginationQuery) {
    const result = await this.commandBus.execute(new GetTopUsersCommand(query));
    return makeAnswerInController(result);
  }

  @UseGuards(JwtAuthGuard)
  @Get('my-statistic')
  async findUnfinishedGame(@CurrentPayload() payload) {
    const userId = payload ? payload.sub : '';
    const result = await this.commandBus.execute(
      new GetMyStatisticCommand(userId),
    );
    return makeAnswerInController(result);
  }
}
