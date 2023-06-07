import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  HttpCode,
  UseGuards,
  Put,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';

import { makeAnswerInController } from '../../helpers/errors';
import { PaginationQuery } from '../../pagination/base-pagination';
import { CreateUserDto } from '../dto/user/create-user.dto';
import { SA_CreateUserCommand } from '../use-cases/users/sa-create-user-case';
import { SA_DeleteUserCommand } from '../use-cases/users/sa-delete-user-case';
import { SA_GetAllUsersCommand } from '../use-cases/users/sa-get-all-users-case';

@Controller('sa/users')
export class UserSAController {
  constructor(private commandBus: CommandBus) {}
  // @UseGuards(BasicAuthGuard)
  @Post()
  async createUser(@Body() inputModel: CreateUserDto) {
    const result = await this.commandBus.execute(
      new SA_CreateUserCommand(inputModel),
    );
    return makeAnswerInController(result);
  }

  // @UseGuards(BasicAuthGuard)
  @Get()
  async findUsers(@Query() query: PaginationQuery) {
    const result = await this.commandBus.execute(
      new SA_GetAllUsersCommand(query),
    );
    return makeAnswerInController(result);
  }

  // @UseGuards(BasicAuthGuard)
  @Delete(':id')
  @HttpCode(204)
  async deleteUser(@Param('id') id: string) {
    const result: boolean | string = await this.commandBus.execute(
      new SA_DeleteUserCommand(id),
    );
    return makeAnswerInController(result);
  }

  // @UseGuards(BasicAuthGuard)
  // @Put(':id/ban')
  // @HttpCode(204)
  // async banUser(@Param('id') userId: string, @Body() inputModel: BanDto) {
  //   const result: boolean | string = await this.commandBus.execute(
  //     new SA_BanUserCommand(userId, inputModel),
  //   );
  //   return makeAnswerInController(result);
  // }
}
