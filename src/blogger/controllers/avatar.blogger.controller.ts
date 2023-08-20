import {
  Controller,
  Delete,
  Get,
  Param,
  ParseFilePipe,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ExpressMulterFileWithResolution,
  ImageValidationPipe,
} from '../../pipes/wallpaper.pipe';
import { log } from 'console';
import { promises as fsPromises } from 'fs';
import { existsSync } from 'fs';
import * as path from 'path';

import { CommandBus } from '@nestjs/cqrs';
import { FileInterceptor } from '@nestjs/platform-express';

import { JwtAuthGuard } from '../../guard/auth-passport/guard-passport/jwt-auth.guard';
import { CheckDir } from '../../adapters/checkDir';
import { CurrentPayload } from '../../decorator/currentUser.decorator';
import { makeAnswerInController } from '../../helpers/errors';
import { DeleteAvatarCommand } from '../use-cases/images/delete-avatar-case';
import { BlogWallpaperCommand } from '../use-cases/images/post-walpaper-blog-case';

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

  @UseGuards(JwtAuthGuard)
  @Post(':blogId/images/wallpaper')
  @UseInterceptors(FileInterceptor('file'))
  async updateWallpaper(
    @Param('blogId') blogId: string,
    @UploadedFile(
      new ImageValidationPipe(1028, 312, 100000, [
        'image/jpg',
        'image/jpeg',
        'image/png',
      ]),
    )
    avatarFile: ExpressMulterFileWithResolution,
    @CurrentPayload() payload,
  ) {
    const userId = payload ? payload.sub : '';
    const finalDir = this.makeFinalDirectory([
      'view',
      'saved',
      userId,
      'wallpaper',
    ]);
    const result = await this.commandBus.execute(
      new BlogWallpaperCommand(userId, blogId, avatarFile, finalDir),
    );
    return makeAnswerInController(result);
  }
  @UseGuards(JwtAuthGuard)
  @Post(':blogId/images/main')
  @UseInterceptors(FileInterceptor('file'))
  async updateMainBlog(
    @Param('blogId') blogId: string,
    @UploadedFile(
      new ImageValidationPipe(156, 156, 100000, [
        'image/jpg',
        'image/jpeg',
        'image/png',
      ]),
    )
    avatarFile: ExpressMulterFileWithResolution,
    @CurrentPayload() payload,
  ) {
    const userId = payload ? payload.sub : '';
    const finalDir = this.makeFinalDirectory(['view', 'saved', userId, 'main']);
    const result = await this.commandBus.execute(
      new BlogMainCommand(userId, blogId, avatarFile, finalDir),
    );
    return makeAnswerInController(result);
  }

  // @Get('avatars')
  // async deleteAvatar() {
  //   log(1);
  //   const result = await this.commandBus.execute(new DeleteAvatarCommand());
  //   return makeAnswerInController(result);
  // }
}
