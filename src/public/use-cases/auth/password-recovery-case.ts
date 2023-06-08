import { randomUUID } from 'crypto';
import { add } from 'date-fns';

import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { MailService } from '../../../mail/mail.service';
import { UserRepository } from '../../../sql/user.repository';

export class PasswordRecoveryCommand {
  constructor(public email: string) {}
}

@CommandHandler(PasswordRecoveryCommand)
export class PasswordRecoveryCase
  implements ICommandHandler<PasswordRecoveryCommand>
{
  constructor(
    private userRepository: UserRepository,
    private mailService: MailService,
  ) {}

  async execute(command: PasswordRecoveryCommand) {
    const confirmationCode = randomUUID().toString();
    const userFind = await this.userRepository.findUserByEmail(command.email);
    if (!userFind) return false;

    await this.mailService.sendUserConfirmation(
      command.email,
      userFind.login,
      confirmationCode,
    );
    const expirationDate = add(new Date(), {
      hours: 1,
      minutes: 3,
    });

    userFind.confirmationCode = confirmationCode;
    userFind.expirationDate = expirationDate;
    await this.userRepository.update(userFind);

    return true;
  }
}
