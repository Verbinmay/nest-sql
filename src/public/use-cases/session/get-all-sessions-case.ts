import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import {
  Session,
  getSessionViewModel,
} from '../../../entities/sql/session.entity';
import { SessionRepository } from '../../../sql/sessions.repository';

export class GetAllSessionsCommand {
  constructor(public userId: string) {}
}

@CommandHandler(GetAllSessionsCommand)
export class GetAllSessionsCase
  implements ICommandHandler<GetAllSessionsCommand>
{
  constructor(private readonly sessionRepository: SessionRepository) {}

  async execute(command: GetAllSessionsCommand) {
    const userSessions: Array<Session> =
      await this.sessionRepository.findSessionsByUserId(command.userId);

    return userSessions.map((s) => getSessionViewModel(s));
  }
}
