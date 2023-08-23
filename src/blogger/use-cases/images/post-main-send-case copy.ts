import sharp from 'sharp';

import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { Blog, getBlogViewModel } from '../../../entities/sql/blog.entity';
import { Images } from '../../../entities/sql/image.entity';
import { Post, getPostViewModel } from '../../../entities/sql/post.entity';
import { FileStorageAdapter } from '../../../adapters/fileStorage.adapter';
import { ExpressMulterFileWithResolution } from '../../../pipes/wallpaper.pipe';
import { BlogRepository } from '../../../sql/blog.repository';
import { ImagesRepository } from '../../../sql/image.repository';
import { PostRepository } from '../../../sql/post.repository';

export class PostMainCommand {
  constructor(
    public userId: string,
    public postId: string,
    public imageFile: ExpressMulterFileWithResolution,
    public finalDir: string,
  ) {}
}

@CommandHandler(PostMainCommand)
export class PostMainCase implements ICommandHandler<PostMainCommand> {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly imageRepository: ImagesRepository,
    private readonly fileStorageAdapter: FileStorageAdapter,
  ) {}

  async execute(command: PostMainCommand) {
    const post: Post | null = await this.postRepository.findPostById(
      command.postId,
    );
    if (!post) return { s: 404 };
    if (post.user.id !== command.userId) return { s: 403 };

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
      'post',
      post,
    );

    await this.imageRepository.create(image);
    const postUpdated: Post | null = await this.postRepository.findPostById(
      command.postId,
    );
    return getPostViewModel(postUpdated, command.userId);
  }
}
