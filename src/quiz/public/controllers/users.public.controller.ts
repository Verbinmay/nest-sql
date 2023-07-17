import { Controller, Get, UseGuards } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';

import { JwtAuthGuard } from '../../../guard/auth-passport/guard-passport/jwt-auth.guard';
import { CurrentPayload } from '../../../decorator/currentUser.decorator';
import { makeAnswerInController } from '../../../helpers/errors';
import { GetMyStatisticCommand } from '../use-cases/get-my-statistic-case';

@Controller('pair-game-quiz/users')
export class UserPairController {
  constructor(private commandBus: CommandBus) {}

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
