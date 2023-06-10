import { randomUUID } from 'crypto';
import { add } from 'date-fns';

import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { User } from '../../../entities/sql/user.entity';
import { errorMaker } from '../../../helpers/errors';
import { MailService } from '../../../mail/mail.service';
import { UserRepository } from '../../../sql/user.repository';

export class ResendingEmailCommand {
  constructor(public email: string) {}
}

@CommandHandler(ResendingEmailCommand)
export class ResendingEmailCase
  implements ICommandHandler<ResendingEmailCommand>
{
  constructor(
    private userRepository: UserRepository,
    private mailService: MailService,
  ) {}

  async execute(command: ResendingEmailCommand) {
    const userFind: User | null = await this.userRepository.findUserByEmail(
      command.email,
    );

    if (!userFind || userFind.isConfirmed === true) {
      return {
        s: 400,
        mf: errorMaker([
          ' inputModel has incorrect values or if email is already confirmed',
          'email',
        ]),
      };
    }

    const confirmationCode = randomUUID();
    const expirationDate = add(new Date(), {
      hours: 1,
      minutes: 3,
    });
    userFind.confirmationCode = confirmationCode;
    userFind.expirationDate = expirationDate;

    await this.userRepository.update(userFind);

    await this.mailService.sendUserConfirmation(
      command.email,
      userFind.login,
      confirmationCode,
    );

    return true;
  }
}
