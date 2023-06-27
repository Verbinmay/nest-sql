import {
  Controller,
  Get,
  Param,
  Query,
  HttpCode,
  UseGuards,
  Post,
  Delete,
  Put,
  Body,
} from '@nestjs/common';
import { UUID } from 'crypto';

import { CommandBus } from '@nestjs/cqrs';

import { JwtAuthGuard } from '../../../guard/auth-passport/guard-passport/jwt-auth.guard';
import { CurrentPayload } from '../../../decorator/currentUser.decorator';
import { makeAnswerInController } from '../../../helpers/errors';
import { CreateAnswerDto } from '../dto/create-answer.dto';
import { CreateAnswerCommand } from '../use-cases/create-answer-case';
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
  @Post('my-current/answers')
  @HttpCode(200)
  async createAnswer(
    @CurrentPayload() payload,
    @Body() inputModel: CreateAnswerDto,
  ): Promise<any> {
    const userId = payload ? payload.sub : '';
    const result = await this.commandBus.execute(
      new CreateAnswerCommand(userId, inputModel),
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
}
