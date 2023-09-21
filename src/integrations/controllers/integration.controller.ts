import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  UseGuards,
} from '@nestjs/common';
import { log } from 'console';

import { CommandBus } from '@nestjs/cqrs';

import { JwtAuthGuard } from '../../guard/auth-passport/guard-passport/jwt-auth.guard';
import { CurrentPayload } from '../../decorator/currentUser.decorator';
import { makeAnswerInController } from '../../helpers/errors';
import { CheckStartMessageCommand } from '../use-cases/check-start-telegram-case';
import { GetAuthBotLinkCommand } from '../use-cases/get-telegram-link-case';

@Controller('integrations')
export class IntegrationsController {
  constructor(private commandBus: CommandBus) {}

  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  @Get('telegram/auth-bot-link')
  async getAuthBotLink(@CurrentPayload() user) {
    const userId = user ? user.sub : '';
    const result = await this.commandBus.execute(
      new GetAuthBotLinkCommand(userId),
    );
    return makeAnswerInController(result);
  }
  @HttpCode(204)
  @Post('telegram/webhook')
  async webhook(@Body() payload: inputMessage) {
    log(payload);
    if (!payload.message) return;

    if (payload.message.text.includes('/start')) {
      const result = await this.commandBus.execute(
        new CheckStartMessageCommand(payload),
      );
    }
    return;
  }
}
export type inputMessage = {
  update_id: number;
  message: {
    message_id: number;
    from: {
      id: number;
      is_bot: boolean;
      first_name: string;
      username: string;
      language_code: string;
    };
    chat: {
      id: number;
      first_name: string;
      username: string;
      type: string;
    };
    date: number;
    text?: string;
    sticker?: object;
  };
};
