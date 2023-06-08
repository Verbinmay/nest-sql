import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { User } from '../../../entities/sql/user.entity';
import { UserRepository } from '../../../sql/user.repository';

export class GetMeCommand {
  constructor(public userId: string) {}
}

@CommandHandler(GetMeCommand)
export class GetMeCase implements ICommandHandler<GetMeCommand> {
  constructor(private userRepository: UserRepository) {}

  async execute(command: GetMeCommand) {
    const user: User | null = await this.userRepository.findUserById(
      command.userId,
    );

    if (!user) {
      return { s: 404 };
    }

    return {
      email: user.email,
      login: user.login,
      userId: user.id,
    };
  }
}
