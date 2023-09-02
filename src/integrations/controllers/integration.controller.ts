import { Controller, Get, HttpCode, UseGuards } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';

import { JwtAuthGuard } from '../../guard/auth-passport/guard-passport/jwt-auth.guard';
import { CurrentPayload } from '../../decorator/currentUser.decorator';
import { makeAnswerInController } from '../../helpers/errors';
import { GetAuthBotLinkCommand } from '../use-cases/get-telegram-link-case';

@Controller('integrations')
export class IntegrationsController {
  constructor(private commandBus: CommandBus) {}

  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  @Get('/telegram/auth-bot-link')
  async getAuthBotLink(@CurrentPayload() user) {
    const userId = user ? user.sub : '';
    const result = await this.commandBus.execute(
      new GetAuthBotLinkCommand(userId),
    );
    return makeAnswerInController(result);
  }
}
