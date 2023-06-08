// import { Controller, Delete, Get, HttpCode, Param } from '@nestjs/common';
// import { InjectModel } from '@nestjs/mongoose';

// import { Blog, BlogsModelType } from '../../entities/blog.entity';
// import { Comment, CommentsModelType } from '../../entities/comment.entity';
// import { Post, PostsModelType } from '../../entities/post.entity';
// import { Session, SessionModelType } from '../../entities/session.entity';
// import { User, UserModelType } from '../../entities/user.entity';

// @Controller('testing')
// export class TestController {
//   constructor(
//     @InjectModel(Blog.name)
//     private blogsModel: BlogsModelType,
//     @InjectModel(Comment.name)
//     private commentsModel: CommentsModelType,
//     @InjectModel(Post.name)
//     private postsModel: PostsModelType,
//     @InjectModel(Session.name)
//     private sessionsModel: SessionModelType,
//     @InjectModel(User.name)
//     private usersModel: UserModelType,
//   ) {}

//   @HttpCode(204)
//   @Delete('all-data')
//   async deleteAll() {
//     await this.blogsModel.deleteMany({});
//     await this.postsModel.deleteMany({});
//     await this.usersModel.deleteMany({});
//     await this.commentsModel.deleteMany({});
//     await this.sessionsModel.deleteMany({});
//     return;
//   }

//   @Get('user/:login')
//   async getUsers(@Param('login') login: string) {
//     return await this.usersModel.find({ login: login });
//   }
// }
