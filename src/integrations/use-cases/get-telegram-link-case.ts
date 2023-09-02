import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { HttpServer } from '@nestjs/common';

export class GetAuthBotLinkCommand {
  constructor(public userId: string) {}
}

@CommandHandler(GetAuthBotLinkCommand)
export class GetAuthBotLinkCase
  implements ICommandHandler<GetAuthBotLinkCommand>
{
  constructor(private httpServer: HttpServer) {}

  async execute(command: GetAuthBotLinkCommand) {
    const baseUrl = this.httpServer.axiosRef.defaults.baseURL;
    const result: PaginatorBlog = await this.blogQueryRepository.findBlogs(
      command.query,
    );

    return result;
  }
}
