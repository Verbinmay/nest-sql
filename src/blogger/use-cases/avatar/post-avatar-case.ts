import { log } from 'console';
import * as path from 'path';
import sharp from 'sharp';

import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { CheckDir } from '../../../adapters/checkDir';
import { FileStorageAdapter } from '../../../adapters/fileStorage.adapter';
import { PostRepository } from '../../../sql/post.repository';

export class PostAvatarCommand {
  constructor(
    public userId: string,
    public blogId: string,
    public avatarFile: Express.Multer.File,
    public finalDir: string,
  ) {}
}

@CommandHandler(PostAvatarCommand)
export class PostAvatarCase implements ICommandHandler<PostAvatarCommand> {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly fileStorageAdapter: FileStorageAdapter,
  ) {}

  async execute(command: PostAvatarCommand) {
    await CheckDir(command.finalDir);

    async function CheckImage(
      //   width: number,
      //   height: number,
      //   size: number,
      buffer: Buffer,
    ) {
      const metadata = await sharp(buffer).metadata();
    }
    await CheckImage(command.avatarFile.buffer);
    const savedAvatar = await this.fileStorageAdapter.saveAvatar(
      command.finalDir,
      command.avatarFile.originalname,
      command.avatarFile.buffer,
    );

    const size = command.avatarFile.size;

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
