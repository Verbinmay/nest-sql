import { log } from 'console';
import * as path from 'path';

import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { CheckDir } from '../../../adapters/checkDir';
import { FileStorageAdapter } from '../../../adapters/fileStorage.adapter';
import { PostRepository } from '../../../sql/post.repository';

export class DeleteAvatarCommand {}

@CommandHandler(DeleteAvatarCommand)
export class DeleteAvatarCase implements ICommandHandler<DeleteAvatarCommand> {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly fileStorageAdapter: FileStorageAdapter,
  ) {}

  async execute(command: DeleteAvatarCommand) {
    const upload = await this.fileStorageAdapter.deleteAvatar();
    console.log(upload);
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
