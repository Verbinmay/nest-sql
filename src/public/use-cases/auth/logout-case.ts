import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { SessionRepository } from '../../../sql/sessions.repository';

export class LogoutCommand {
  constructor(public payload: any) {}
}

@CommandHandler(LogoutCommand)
export class LogoutCase implements ICommandHandler<LogoutCommand> {
  constructor(private sessionRepository: SessionRepository) {}

  async execute(command: LogoutCommand) {
    const tokenRevoked: boolean =
      await this.sessionRepository.deleteSessionsByDeviceId(
        command.payload.deviceId,
      );

    return tokenRevoked === true ? tokenRevoked : { s: 404 };
  }
}
