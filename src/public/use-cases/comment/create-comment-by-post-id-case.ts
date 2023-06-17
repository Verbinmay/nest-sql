import {
  Comment,
  getCommentViewModel,
} from '../../../entities/sql/comment.entity';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { BanedUser } from '../../../entities/sql/blogsBannedUsers.entity';
import { Post } from '../../../entities/sql/post.entity';
import { User } from '../../../entities/sql/user.entity';
import { BanedUsersBlogsRepository } from '../../../sql/blog.banUsers.repository';
import { CommentRepository } from '../../../sql/comment.repository';
import { PostRepository } from '../../../sql/post.repository';
import { UserRepository } from '../../../sql/user.repository';
import { CreateCommentDto } from '../../dto/comment/create-comment.dto';

export class PostCommentByBlogIdCommand {
  constructor(
    public postId: string,
    public userId: string,
    public inputModel: CreateCommentDto,
  ) {}
}

@CommandHandler(PostCommentByBlogIdCommand)
export class CreateCommentByBlogIdCase
  implements ICommandHandler<PostCommentByBlogIdCommand>
{
  constructor(
    private readonly commentRepository: CommentRepository,
    private readonly postRepository: PostRepository,
    private readonly userRepository: UserRepository,
    private readonly banedUsersBlogsRepository: BanedUsersBlogsRepository,
  ) {}

  async execute(command: PostCommentByBlogIdCommand) {
    const post: Post | null = await this.postRepository.findPostById(
      command.postId,
    );
    if (!post) {
      return { s: 404 };
    }

    const user: User | null = await this.userRepository.findUserById(
      command.userId,
    );
    if (!user) {
      return { s: 404 };
    }
    /**Проверка на забаненность  */
    const blogsBan: BanedUser | null =
      await this.banedUsersBlogsRepository.findBanedUsersByBlogId(
        user.id,
        post.blog.id,
      );
    if (blogsBan) {
      return { s: 403 };
    }
    const comment = new Comment();
    comment.content = command.inputModel.content;
    comment.post = post;
    comment.user = user;

    const commentCreated = await this.commentRepository.create(comment);
    const commentFound = await this.commentRepository.findById(
      commentCreated.id,
    );

    return getCommentViewModel(commentFound, command.userId);
  }
}
