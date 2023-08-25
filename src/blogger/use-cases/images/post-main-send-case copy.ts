import { S3StorageAdapter } from '../../../adapters/fileStorage.adapter';
import { randomUUID } from 'crypto';
import sharp from 'sharp';

import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { Blog } from '../../../entities/sql/blog.entity';
import { Images } from '../../../entities/sql/image.entity';
import { Post, getPostViewModel } from '../../../entities/sql/post.entity';
import { ExpressMulterFileWithResolution } from '../../../pipes/wallpaper.pipe';
import { BlogRepository } from '../../../sql/blog.repository';
import { ImagesRepository } from '../../../sql/image.repository';
import { PostRepository } from '../../../sql/post.repository';

export class PostMainCommand {
  constructor(
    public userId: string,
    public postId: string,
    public blogId: string,
    public imageFile: ExpressMulterFileWithResolution,
    public finalDir: string,
  ) {}
}

@CommandHandler(PostMainCommand)
export class PostMainCase implements ICommandHandler<PostMainCommand> {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly blogRepository: BlogRepository,
    private readonly imageRepository: ImagesRepository,
    private readonly fileStorageAdapter: S3StorageAdapter,
  ) {}

  async execute(command: PostMainCommand) {
    const blog: Blog | null = await this.blogRepository.findBlogById(
      command.blogId,
    );
    if (!blog) return { s: 404 };
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

    const imageSaved = await this.imageRepository.create(image);

    await this.CreateAnotherSizeImage(
      command.imageFile.buffer,
      command.finalDir,
      149,
      96,
      post,
      imageSaved,
    );

    await this.CreateAnotherSizeImage(
      command.imageFile.buffer,
      command.finalDir,
      300,
      180,
      post,
      imageSaved,
    );

    const postUpdated: Post | null = await this.postRepository.findPostById(
      command.postId,
    );

    return (await getPostViewModel(postUpdated, command.userId)).images;
  }

  async CreateAnotherSizeImage(
    buffer: Buffer,
    directory: string,
    width: number,
    height: number,
    post: Post,
    image: Images,
  ) {
    const sizeChangedBuffer: Buffer = await sharp(buffer)
      .resize(width, height, {
        fit: 'cover',
      })
      .toBuffer();

    const newImageSaved: { url: string } =
      await this.fileStorageAdapter.saveImage(
        directory,
        randomUUID(),
        sizeChangedBuffer,
      );

    const data = await sharp(sizeChangedBuffer).metadata();

    const newImageClass = new Images(
      newImageSaved.url,
      width,
      height,
      data.size,
      'post',
      post,
    );
    newImageClass.bigImage = image;

    await this.imageRepository.create(newImageClass);
  }
}
