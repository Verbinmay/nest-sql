import * as bcrypt from 'bcrypt';

import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { SAGetViewModel, User } from '../../../entities/sql/user.entity';
import { UserRepository } from '../../../sql/user.repository';
import { CreateUserDto } from '../../dto/user/create-user.dto';

export class SA_CreateUserCommand {
  constructor(public inputModel: CreateUserDto) {}
}

@CommandHandler(SA_CreateUserCommand)
export class SA_CreateUserCase
  implements ICommandHandler<SA_CreateUserCommand>
{
  constructor(private readonly userRepository: UserRepository) {}

  async execute(command: SA_CreateUserCommand) {
    /**Функция для проверки типа переданных данных, но по мне она бесполезна */
    // await validateOrRejectModel(inputModel, CreateUserDto);

    const hashBcrypt = await bcrypt.hash(command.inputModel.password, 10);

    const user: User = new User();
    user.login = command.inputModel.login;
    user.email = command.inputModel.email;
    user.hash = hashBcrypt;
    user.isConfirmed = true;

    const result: User = await this.userRepository.save(user);

    return SAGetViewModel(result);
  }
}

// async function validateOrRejectModel(
//   inputModel: any,
//   classForm: { new (): any },
// ) {
//   if (inputModel instanceof classForm === false) {
//     throw new Error('Incorrect input data');
//   }
//   try {
//     await validateOrReject(inputModel);
//   } catch (error) {
//     throw new Error(error);
//   }
// }
