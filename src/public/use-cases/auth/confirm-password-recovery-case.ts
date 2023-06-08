import * as bcrypt from 'bcrypt';

import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { errorMaker } from '../../../helpers/errors';
import { UserRepository } from '../../../sql/user.repository';
import { NewPassword } from '../../dto/auth/input-newpassword.dto';

export class ConfirmPasswordRecoveryCommand {
  constructor(public inputModel: NewPassword) {}
}

@CommandHandler(ConfirmPasswordRecoveryCommand)
export class ConfirmPasswordRecoveryCase
  implements ICommandHandler<ConfirmPasswordRecoveryCommand>
{
  constructor(private userRepository: UserRepository) {}

  async execute(command: ConfirmPasswordRecoveryCommand) {
    const userFind = await this.userRepository.findUserByConfirmationCode(
      command.inputModel.recoveryCode,
    );
    if (
      !userFind ||
      userFind.confirmationCode !== command.inputModel.recoveryCode ||
      userFind.expirationDate < new Date()
    ) {
      return {
        s: 400,
        mf: errorMaker([
          'If the confirmation code is incorrect, expired or already been applied',
          'recoveryCode',
        ]),
      };
    }
    const hashBcrypt = await bcrypt.hash(command.inputModel.newPassword, 10);

    userFind.isConfirmed = true;
    userFind.hash = hashBcrypt;

    await this.userRepository.update(userFind);

    return true;
  }
}
