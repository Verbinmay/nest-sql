import {
  Controller,
  Get,
  Param,
  Query,
  Put,
  HttpCode,
  UseGuards,
  Body,
  Post,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';

import { BasicAuthGuard } from '../../../guard/auth-passport/guard-passport/basic-auth.guard';
import { makeAnswerInController } from '../../../helpers/errors';
import { CreateQuestionDto as CreateQuestionDto } from '../dto/create-question.dto';
import { SA_CreateQuestionCommand } from '../use-cases/sa-create-question-case';

@Controller('sa/quiz/questions')
export class QuestionSAController {
  constructor(private commandBus: CommandBus) {}

  @UseGuards(BasicAuthGuard)
  @Post()
  async SA_CreateQuestion(@Body() inputModel: CreateQuestionDto) {
    const result = await this.commandBus.execute(
      new SA_CreateQuestionCommand(inputModel),
    );
    return makeAnswerInController(result);
  }

  // @UseGuards(BasicAuthGuard)
  // @Get()
  // async SA_GetAllBlogs(@Query() query: PaginationQuery) {
  //   const result = await this.commandBus.execute(
  //     new SA_GetAllBlogsCommand(query),
  //   );
  //   return makeAnswerInController(result);
  // }

  // @UseGuards(BasicAuthGuard)
  // @Put(':id/bind-with-user/:userId')
  // @HttpCode(204)
  // async bindBlogWithUser(
  //   @Param('id') blogId: string,
  //   @Param('userId') userId: string,
  // ) {
  //   const result = await this.commandBus.execute(
  //     new SA_BindBlogWithUserCommand(blogId, userId),
  //   );
  //   return makeAnswerInController(result);
  // }

  // @UseGuards(BasicAuthGuard)
  // @Put(':id/ban')
  // @HttpCode(204)
  // async banBlogById(
  //   @Param('id') blogId: string,
  //   @Body() inputModel: SABanBlogDto,
  // ) {
  //   const result = await this.commandBus.execute(
  //     new SA_BanBlogCommand(blogId, inputModel),
  //   );
  //   return makeAnswerInController(result);
  // }
}
