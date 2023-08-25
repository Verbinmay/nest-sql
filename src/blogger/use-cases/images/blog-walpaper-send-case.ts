import { S3StorageAdapter } from '../../../adapters/fileStorage.adapter';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { Blog, getBlogViewModel } from '../../../entities/sql/blog.entity';
import { Images } from '../../../entities/sql/image.entity';
import { ExpressMulterFileWithResolution } from '../../../pipes/wallpaper.pipe';
import { BlogRepository } from '../../../sql/blog.repository';
import { ImagesRepository } from '../../../sql/image.repository';

export class BlogWallpaperCommand {
  constructor(
    public userId: string,
    public blogId: string,
    public imageFile: ExpressMulterFileWithResolution,
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
    private readonly fileStorageAdapter: S3StorageAdapter,
  ) {}

  async execute(command: BlogWallpaperCommand) {
    const blog: Blog | null = await this.blogRepository.findBlogById(
      command.blogId,
    );
    if (!blog) return { s: 404 };
    if (blog.user.id !== command.userId) return { s: 403 };

    const wallpaper = blog.images.filter((i) => i.type === 'wallpaper');
    if (wallpaper.length > 0) {
      await this.fileStorageAdapter.deleteImage(wallpaper[0].url);
      await this.imageRepository.delete(wallpaper[0].url);
    }
    const savedWallpaper = await this.fileStorageAdapter.saveImage(
      command.finalDir,
      command.imageFile.originalname,
      command.imageFile.buffer,
    );

    const image = new Images(
      savedWallpaper.url,
      command.imageFile.width,
      command.imageFile.height,
      command.imageFile.size,
      'wallpaper',
      blog,
    );

    await this.imageRepository.create(image);

    const blogUpdated: Blog | null = await this.blogRepository.findBlogById(
      command.blogId,
    );
    // это обработчик ссылок
    // const images = [];
    // for (let i = 0; i < blogUpdated.images.length; i++) {
    //   const b = await this.fileStorageAdapter.getURL(blogUpdated.images[i].url);

    //   images.push({
    //     ...image,
    //     url: b,
    //   });
    // }

    // blogUpdated.images = images;
    return (await getBlogViewModel(blogUpdated)).images;
  }
}
