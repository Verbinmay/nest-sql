import { log } from 'console';
import { randomUUID } from 'crypto';
import sharp from 'sharp';
import { setTimeout } from 'timers/promises';
import { Repository } from 'typeorm';

import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Injectable } from '@nestjs/common';

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
    log(postUpdated, 'postUpdated');
    return getPostViewModel(postUpdated, command.userId);
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
