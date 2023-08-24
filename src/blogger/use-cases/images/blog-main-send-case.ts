import {
  FileStorageAdapter,
  S3StorageAdapter,
} from '../../../adapters/fileStorage.adapter';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { Blog, getBlogViewModel } from '../../../entities/sql/blog.entity';
import { Images } from '../../../entities/sql/image.entity';
import { ExpressMulterFileWithResolution } from '../../../pipes/wallpaper.pipe';
import { BlogRepository } from '../../../sql/blog.repository';
import { ImagesRepository } from '../../../sql/image.repository';

export class BlogMainCommand {
  constructor(
    public userId: string,
    public blogId: string,
    public imageFile: ExpressMulterFileWithResolution,
    public finalDir: string,
  ) {}
}

@CommandHandler(BlogMainCommand)
export class BlogMainCase implements ICommandHandler<BlogMainCommand> {
  constructor(
    private readonly blogRepository: BlogRepository,
    private readonly imageRepository: ImagesRepository,
    private readonly fileStorageAdapter: S3StorageAdapter,
  ) {}

  async execute(command: BlogMainCommand) {
    const blog: Blog | null = await this.blogRepository.findBlogById(
      command.blogId,
    );
    if (!blog) return { s: 404 };
    if (blog.user.id !== command.userId) return { s: 403 };

    const savedMain = await this.fileStorageAdapter.saveImage(
      command.finalDir,
      command.imageFile.originalname,
      command.imageFile.buffer,
    );

    const image = new Images(
      savedMain.url,
      command.imageFile.width,
      command.imageFile.height,
      command.imageFile.size,
      'main',
      blog,
    );

    const result = await this.imageRepository.create(image);
    const blogUpdated: Blog | null = await this.blogRepository.findBlogById(
      command.blogId,
    );
    return (await getBlogViewModel(blogUpdated)).images;
  }
}
