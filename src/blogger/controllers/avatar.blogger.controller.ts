import {
  Controller,
  Get,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { promises as fsPromises } from 'fs';
import { existsSync } from 'fs';
import * as path from 'path';

import { CommandBus } from '@nestjs/cqrs';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('blogger/blogs')
export class AvatarBloggersController {
  constructor(private commandBus: CommandBus) {}

  @Get('change/avatar')
  async changeAvatarPage() {
    const currentDir = path.dirname(require.main.filename);
    const finalDir = path.join(currentDir, 'view', 'changeAvatarPage.html');

    return await fsPromises.readFile(finalDir, { encoding: 'utf-8' });
  }

  @Post('avatar')
  @UseInterceptors(FileInterceptor('avatar'))
  async updateAvatar(@UploadedFile() avatarFile: Express.Multer.File) {
    console.log(avatarFile);
    const currentDir = path.dirname(require.main.filename);
    const finalDir = path.join(currentDir, 'view', 'saved');
    if (!existsSync(finalDir)) {
      await fsPromises.mkdir(finalDir, { recursive: true });
    }
    await fsPromises.writeFile(
      path.join(finalDir, avatarFile.originalname),
      avatarFile.buffer,
    );
    return 'avatar saved';
  }
}
