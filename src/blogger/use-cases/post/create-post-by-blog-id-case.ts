import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { Blog } from '../../../entities/sql/blog.entity';
import { Post, getPostViewModel } from '../../../entities/sql/post.entity';
import { BlogRepository } from '../../../sql/blog.repository';
import { LikePostRepository } from '../../../sql/post.like.repository';
import { PostRepository } from '../../../sql/post.repository';
import { CreatePostBlogDto } from '../../dto/post/create-post-in-blog.dto';

export class CreatePostByBlogIdCommand {
  constructor(
    public blogId: string,
    public userId: string,
    public inputModel: CreatePostBlogDto,
  ) {}
}

@CommandHandler(CreatePostByBlogIdCommand)
export class CreatePostByBlogIdCase
  implements ICommandHandler<CreatePostByBlogIdCommand>
{
  constructor(
    private readonly blogRepository: BlogRepository,
    private readonly postRepository: PostRepository,
    private readonly likePostRepository: LikePostRepository,
  ) {}

  async execute(command: CreatePostByBlogIdCommand) {
    const blog: Blog | null = await this.blogRepository.findBlogById(
      command.blogId,
    );
    if (!blog) return { s: 404 };
    if (blog.userId !== command.userId) return { s: 403 };

    const post: Post = new Post();

    post.title = command.inputModel.title;
    post.shortDescription = command.inputModel.shortDescription;
    post.content = command.inputModel.content;
    post.blogName = blog.name;
    post.blogId = command.blogId;
    post.userId = command.userId;

    const postSaved = await this.postRepository.create(post);
    const likes = await this.likePostRepository.findLikesForPosts([postSaved]);

    return getPostViewModel(postSaved, likes, command.userId);
  }
}
