import crypto from 'crypto';

import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { HttpServer } from '@nestjs/common';

import { UserRepository } from '../../sql/user.repository';

export class GetAuthBotLinkCommand {
  constructor(public userId: string) {}
}

@CommandHandler(GetAuthBotLinkCommand)
export class GetAuthBotLinkCase
  implements ICommandHandler<GetAuthBotLinkCommand>
{
  constructor(private readonly userRepository: UserRepository) {}
  async execute(command: GetAuthBotLinkCommand) {
    const user = await this.userRepository.findUserById(command.userId);
    return {
      link: `https://t.me/socialBotDot_bot?code=${user.login}`,
    };
  }
}
