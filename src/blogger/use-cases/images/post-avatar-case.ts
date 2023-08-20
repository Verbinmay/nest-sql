import { log } from 'console';
import * as path from 'path';
import sharp from 'sharp';

import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { Blog, getBlogViewModel } from '../../../entities/sql/blog.entity';
import { Images } from '../../../entities/sql/image.entity';
import { CheckDir } from '../../../adapters/checkDir';
import { FileStorageAdapter } from '../../../adapters/fileStorage.adapter';
import { getImageViewModelUtil } from '../../../helpers/images.util';
import { ExpressMulterFileWithResolution } from '../../../pipes/wallpaper.pipe';
import { BlogRepository } from '../../../sql/blog.repository';
import { ImagesRepository } from '../../../sql/image.repository';
import { PostRepository } from '../../../sql/post.repository';

export class BlogWallpaperCommand {
  constructor(
    public userId: string,
    public blogId: string,
    public avatarFile: ExpressMulterFileWithResolution,
    public finalDir: string,
  ) {}
}

@CommandHandler(BlogWallpaperCommand)
export class BlogWallpaperCase
  implements ICommandHandler<BlogWallpaperCommand>
{
  constructor(
    private readonly blogRepository: BlogRepository,
    private readonly imageRepository: ImagesRepository,
    private readonly fileStorageAdapter: FileStorageAdapter,
  ) {}

  async execute(command: BlogWallpaperCommand) {
    const blog: Blog | null = await this.blogRepository.findBlogById(
      command.blogId,
    );
    if (!blog) return { s: 404 };
    if (blog.user.id !== command.userId) return { s: 403 };

    const wallpaper = blog.images.filter((i) => i.type === 'wallpaper');
    if (wallpaper.length > 0) {
      const result = await this.fileStorageAdapter.deleteAvatar(
        wallpaper[0].url,
      );
      await this.imageRepository.delete(wallpaper[0].url);
    }
    const savedAvatar = await this.fileStorageAdapter.saveAvatar(
      command.finalDir,
      command.avatarFile.originalname,
      command.avatarFile.buffer,
    );

    const image = new Images();
    image.url = savedAvatar.url;
    image.width = command.avatarFile.width;
    image.height = command.avatarFile.height;
    image.fileSize = command.avatarFile.size;
    image.type = 'wallpaper';
    image.blog = blog;

    const result = await this.imageRepository.create(image);
    const blogUpdated: Blog | null = await this.blogRepository.findBlogById(
      command.blogId,
    );
    return getBlogViewModel(blogUpdated).images;
  }
}
