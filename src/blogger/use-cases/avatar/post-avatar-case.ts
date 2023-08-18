import { log } from 'console';
import * as path from 'path';
import sharp from 'sharp';

import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { Blog } from '../../../entities/sql/blog.entity';
import { CheckDir } from '../../../adapters/checkDir';
import { FileStorageAdapter } from '../../../adapters/fileStorage.adapter';
import { BlogRepository } from '../../../sql/blog.repository';
import { PostRepository } from '../../../sql/post.repository';

export class BlogWallpaperCommand {
  constructor(
    public userId: string,
    public blogId: string,
    public avatarFile: Express.Multer.File,
    public finalDir: string,
  ) {}
}

@CommandHandler(BlogWallpaperCommand)
export class BlogWallpaperCase
  implements ICommandHandler<BlogWallpaperCommand>
{
  constructor(
    private readonly blogRepository: BlogRepository,
    private readonly fileStorageAdapter: FileStorageAdapter,
  ) {}

  async execute(command: BlogWallpaperCommand) {
    const blog: Blog | null = await this.blogRepository.findBlogById(
      command.blogId,
    );
    const savedAvatar = await this.fileStorageAdapter.saveAvatar(
      command.finalDir,
      command.avatarFile.originalname,
      command.avatarFile.buffer,
    );

    // const postsFromDb: Post[] = await this.postRepository.findPostsByUserId(
    //   command.userId,
    // );
    // const result: PaginatorCommentWithWithPostInfoViewModel =
    //   await this.commentQueryRepository.getCommentsWithPostInfoByPostsId(
    //     command.query,
    //     postsFromDb.map((p) => p.id),
    //     command.userId,
    //   );
    // return result;
    return 'ok';
  }
}
