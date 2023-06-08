import * as bcrypt from 'bcrypt';

import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { CreateUserDto } from '../../../sa/dto/user/create-user.dto';
import { User } from '../../../entities/sql/user.entity';
import { MailService } from '../../../mail/mail.service';
import { UserRepository } from '../../../sql/user.repository';

export class RegistrationCommand {
  constructor(public inputModel: CreateUserDto) {}
}

@CommandHandler(RegistrationCommand)
export class RegistrationCase implements ICommandHandler<RegistrationCommand> {
  constructor(
    private userRepository: UserRepository,
    private mailService: MailService,
  ) {}

  async execute(command: RegistrationCommand) {
    const hashBcrypt = await bcrypt.hash(command.inputModel.password, 10);

    const user: User = new User();
    user.login = command.inputModel.login;
    user.email = command.inputModel.email;
    user.hash = hashBcrypt;

    await this.userRepository.create(user);

    await this.mailService.sendUserConfirmation(
      command.inputModel.email,
      command.inputModel.login,
      user.confirmationCode,
    );

    return true;
  }
}
