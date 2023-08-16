import {
  Controller,
  Get,
  Param,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { promises as fsPromises } from 'fs';
import { existsSync } from 'fs';
import * as path from 'path';

import { CommandBus } from '@nestjs/cqrs';
import { FileInterceptor } from '@nestjs/platform-express';

import { JwtAuthGuard } from '../../guard/auth-passport/guard-passport/jwt-auth.guard';
import { CheckDir } from '../../adapters/checkDir';
import { CurrentPayload } from '../../decorator/currentUser.decorator';
import { makeAnswerInController } from '../../helpers/errors';
import { PostAvatarCommand } from '../use-cases/avatar/post-avatar-case';

@Controller('blogger/blogs')
export class AvatarBloggersController {
  constructor(private commandBus: CommandBus) {}
  private makeFinalDirectory(directoriesPath: Array<string>) {
    const currentDir = path.dirname(require.main.filename);
    return path.join(currentDir, ...directoriesPath);
  }

  @Get('change/avatar')
  async changeAvatarPage() {
    const finalDir = this.makeFinalDirectory(['view', 'changeAvatarPage.html']);

    return await fsPromises.readFile(finalDir, { encoding: 'utf-8' });
  }

  //   @UseGuards(JwtAuthGuard)
  @Post('avatar')
  //   @Post(':blogId/images/wallpaper')
  @UseInterceptors(FileInterceptor('avatar'))
  async updateAvatar(
    @Param('blogId') blogId: string,
    @UploadedFile() avatarFile: Express.Multer.File,
    @CurrentPayload() payload,
  ) {
    const userId = payload ? payload.sub : '';
    const finalDir = this.makeFinalDirectory(['view', 'saved']);
    const result = await this.commandBus.execute(
      new PostAvatarCommand(userId, blogId, avatarFile, finalDir),
    );
    return makeAnswerInController(result);
  }
}
