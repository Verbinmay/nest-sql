import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { User } from '../../../entities/sql/user.entity';
import { errorMaker } from '../../../helpers/errors';
import { UserRepository } from '../../../sql/user.repository';

export class RegistrationConfirmationCommand {
  constructor(public code: string) {}
}

@CommandHandler(RegistrationConfirmationCommand)
export class RegistrationConfirmationCase
  implements ICommandHandler<RegistrationConfirmationCommand>
{
  constructor(private userRepository: UserRepository) {}

  async execute(command: RegistrationConfirmationCommand) {
    const userFind: User | null =
      await this.userRepository.findUserByConfirmationCode(command.code);

    if (
      !userFind &&
      userFind.isConfirmed === true &&
      userFind.confirmationCode !== command.code &&
      userFind.expirationDate < new Date()
    )
      return {
        s: 400,
        mf: errorMaker([
          'If the confirmation code is incorrect, expired or already been applied',
          'code',
        ]),
      };

    const result = await this.userRepository.updateConfirmation(userFind.id);
    if (result === false) return { s: 500 };

    return true;
  }
}
