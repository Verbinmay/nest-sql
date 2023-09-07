import { isUUID } from 'class-validator';
import { log } from 'console';

import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { HttpServer } from '@nestjs/common';

import { User } from '../../entities/sql/user.entity';
import { UserRepository } from '../../sql/user.repository';
import { inputMessage } from '../controllers/integration.controller';

export class CheckStartMessageCommand {
  constructor(public payload: inputMessage) {}
}

@CommandHandler(CheckStartMessageCommand)
export class CheckStartMessageCase
  implements ICommandHandler<CheckStartMessageCommand>
{
  constructor(private readonly userRepository: UserRepository) {}
  async execute(command: CheckStartMessageCommand) {
    const id = command.payload.message.text.split(' ')[1];
    if (isUUID(id)) {
      const user: User = await this.userRepository.findUserById(id);
      if (user) {
        user.telegramId = command.payload.message.chat.id;

        user.telegramSpam = true;
        await this.userRepository.update(user);
        return;
      }
      return;
    }
    if (command.payload.message.text === '/start') {
      const user: User = await this.userRepository.findUserByTelegramId(
        command.payload.message.chat.id,
      );
      if (user && user.telegramSpam === false) {
        user.telegramSpam = true;
        await this.userRepository.update(user);
        return;
      }
      return;
    }

    return;
  }
}
