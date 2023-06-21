import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { SessionRepository } from '../../../sql/sessions.repository';

export class DeleteAllSessionsWithoutCurrentCommand {
  constructor(public userId: string, public deviceId: string) {}
}

@CommandHandler(DeleteAllSessionsWithoutCurrentCommand)
export class DeleteAllSessionsWithoutCurrentCase
  implements ICommandHandler<DeleteAllSessionsWithoutCurrentCommand>
{
  constructor(private readonly sessionRepository: SessionRepository) {}

  async execute(command: DeleteAllSessionsWithoutCurrentCommand) {
    const sessionsDelete =
      await this.sessionRepository.deleteSessionsExceptCurrent(
        command.userId,
        command.deviceId,
      );
    if (sessionsDelete === false) {
      return { s: 404 };
    }
    return true;
  }
}
