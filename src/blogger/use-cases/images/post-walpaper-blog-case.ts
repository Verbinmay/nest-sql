import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { Blog, getBlogViewModel } from '../../../entities/sql/blog.entity';
import { Images } from '../../../entities/sql/image.entity';
import { FileStorageAdapter } from '../../../adapters/fileStorage.adapter';
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
      const result = await this.fileStorageAdapter.deleteImage(
        wallpaper[0].url,
      );
      await this.imageRepository.delete(wallpaper[0].url);
    }
    const savedWallpaper = await this.fileStorageAdapter.saveImage(
      command.finalDir,
      command.imageFile.originalname,
      command.imageFile.buffer,
    );

    const image = new Images();
    image.url = savedWallpaper.url;
    image.width = command.imageFile.width;
    image.height = command.imageFile.height;
    image.fileSize = command.imageFile.size;
    image.type = 'wallpaper';
    image.blog = blog;

    const result = await this.imageRepository.create(image);
    const blogUpdated: Blog | null = await this.blogRepository.findBlogById(
      command.blogId,
    );
    return getBlogViewModel(blogUpdated).images;
  }
}
