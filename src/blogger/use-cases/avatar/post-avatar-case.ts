import { log } from 'console';
import * as path from 'path';

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
    await this.fileStorageAdapter.saveAvatar(
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
