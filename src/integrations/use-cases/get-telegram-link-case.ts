import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { HttpServer } from '@nestjs/common';

export class GetAuthBotLinkCommand {
  constructor(public userId: string) {}
}

@CommandHandler(GetAuthBotLinkCommand)
export class GetAuthBotLinkCase
  implements ICommandHandler<GetAuthBotLinkCommand>
{
  async execute(command: GetAuthBotLinkCommand) {
    return {
      link: `https://t.me/socialBotDot_bot?start=${command.userId}`,
    };
  }
}
