import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { Blog, getBlogViewModel } from '../../../entities/sql/blog.entity';
import { Images } from '../../../entities/sql/image.entity';
import { FileStorageAdapter } from '../../../adapters/fileStorage.adapter';
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
    private readonly fileStorageAdapter: FileStorageAdapter,
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

    const image = new Images();
    image.url = savedMain.url;
    image.width = command.imageFile.width;
    image.height = command.imageFile.height;
    image.fileSize = command.imageFile.size;
    image.type = 'main';
    image.blog = blog;

    const result = await this.imageRepository.create(image);
    const blogUpdated: Blog | null = await this.blogRepository.findBlogById(
      command.blogId,
    );
    return getBlogViewModel(blogUpdated).images;
  }
}
