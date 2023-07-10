import { ConfigModule, ConfigService } from '@nestjs/config';

ConfigModule.forRoot();

import { Module } from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';

import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/sql/user.entity';
import { CqrsModule } from '@nestjs/cqrs';
import { PassportModule } from '@nestjs/passport';
import { MailModule } from './mail/mail.module';
import { ValidationLoginEmail } from './validation/validationLoginEmail';
import { SA_CreateUserCase } from './sa/use-cases/users/sa-create-user-case';
import { UserSAController } from './sa/controllers/user.sa.controller';
import { UserRepository } from './sql/user.repository';
import { UserQueryRepository } from './sql/user.query.repository';
import { SA_GetAllUsersCase } from './sa/use-cases/users/sa-get-all-users-case';
import { SA_DeleteUserCase } from './sa/use-cases/users/sa-delete-user-case';
import { LoginCase } from './public/use-cases/auth/login-case';
import { AppController } from './app.controller';
import { JWTService } from './jwt/jwt.service';
import { AuthController } from './public/controllers/auth.controller';
import { SessionService } from './public/services/session.service';
import { SessionRepository } from './sql/sessions.repository';
import { Session } from './entities/sql/session.entity';
import { AppService } from './app.service';
import { BasicStrategy } from './guard/auth-passport/strategy-passport/basic.strategy';
import { JwtStrategy } from './guard/auth-passport/strategy-passport/jwt.strategy';
import { LocalStrategy } from './guard/auth-passport/strategy-passport/local.strategy';
import { Blog } from './entities/sql/blog.entity';
import { BlogBloggersController } from './blogger/controllers/blog.blogger.controller';
import { CreateBlogCase } from './blogger/use-cases/blog/create-blog-case';
import { BlogRepository } from './sql/blog.repository';
import { UpdateBlogCase } from './blogger/use-cases/blog/update-blog-case';
import { DeleteBlogCase } from './blogger/use-cases/blog/delete-blog-case';
import { BlogQueryRepository } from './sql/blog.query.repository';
import { GetCurrentUserBlogsCase } from './blogger/use-cases/blog/get-current-user-blogs-case';
import { PostLike } from './entities/sql/post.like.entity';
import { Post } from './entities/sql/post.entity';
import { CreatePostByBlogIdCase } from './blogger/use-cases/post/create-post-by-blog-id-case';
import { PostBloggersController } from './blogger/controllers/post.blogger.controller';
import { LikePostRepository } from './sql/post.like.repository';
import { PostRepository } from './sql/post.repository';
import { UpdatePostCase } from './blogger/use-cases/post/update-post-case';
import { DeletePostCase } from './blogger/use-cases/post/delete-post-case';
import { UserBloggersController } from './blogger/controllers/user.blogger.controller';
import { BanUserForBlogByUserIdCase } from './blogger/use-cases/user/ban-user-for-blog-case';
import { BanedUser } from './entities/sql/blogsBannedUsers.entity';
import { BanedUsersBlogsRepository } from './sql/blog.banUsers.repository';
import { BanedUsersBlogsQueryRepository } from './sql/blog.banUsers.query.repository';
import { GetBannedUsersByBlogIdCase } from './blogger/use-cases/user/get-banned-users-by-blog-id-case';
import { CommentBloggersController } from './blogger/controllers/comment.blogger.controller';
import { Comment } from './entities/sql/comment.entity';
import { CommentLike } from './entities/sql/comment.like.entity';
import { GetCommentsWithPostInfoByUserIdCase } from './blogger/use-cases/comment/get-comments-with-post-info-for-current-user';
import { LikeCommentRepository } from './sql/comment.like.repository';
import { CommentQueryRepository } from './sql/comment.query.repository';
import { GetNewTokensCase } from './public/use-cases/auth/get-new-refresh-token-case';
import { LogoutCase } from './public/use-cases/auth/logout-case';
import { GetMeCase } from './public/use-cases/auth/get-me-case';
import { RegistrationConfirmationCase } from './public/use-cases/auth/registration-confirmation-case';
import { PasswordRecoveryCase } from './public/use-cases/auth/password-recovery-case';
import { RegistrationCase } from './public/use-cases/auth/registration-case';
import { ResendingEmailCase } from './public/use-cases/auth/resending-email-case';
import { PostQueryRepository } from './sql/post.query.repository';
import { GetAllPostsByBlogIdCase } from './public/use-cases/post/get-posts-by-blog-id-case';
import { BlogController } from './public/controllers/blog.controller';
import { CommentController } from './public/controllers/comment.controller';
import { PostController } from './public/controllers/post.controller';
import { SessionsController } from './public/controllers/session.controller';
import { ConfirmPasswordRecoveryCase } from './public/use-cases/auth/confirm-password-recovery-case';
import { GetAllBlogsCase } from './public/use-cases/blog/get-all-blogs-case';
import { GetBlogByBlogIdCase } from './public/use-cases/blog/get-blog-by-blog-id-case';
import { CreateCommentByBlogIdCase } from './public/use-cases/comment/create-comment-by-post-id-case';
import { DeleteCommentCase } from './public/use-cases/comment/delete-comment-case';
import { GetCommentByCommentIdCase } from './public/use-cases/comment/get-comment-by-comment-id-case';
import { LikeCommentCase } from './public/use-cases/comment/like-comment-case';
import { UpdateCommentCase } from './public/use-cases/comment/update-comment-case';
import { GetAllPostsCase } from './public/use-cases/post/get-all-posts-case';
import { GetPostByIdCase } from './public/use-cases/post/get-post-by-id-case';
import { LikePostCase } from './public/use-cases/post/like-post-case';
import { DeleteAllSessionsWithoutCurrentCase } from './public/use-cases/session/delete-all-session-without-current-case';
import { DeleteSessionByDeviceIdCase } from './public/use-cases/session/delete-session-by-device-id-case';
import { GetAllSessionsCase } from './public/use-cases/session/get-all-sessions-case';
import { CommentRepository } from './sql/comment.repository';
import { TestController } from './public/controllers/test.controller';
import { BlogSAController } from './sa/controllers/blog.sa.controller';
import { SA_BanBlogCase } from './sa/use-cases/blogs/sa-ban-blog-case';
import { SA_BindBlogWithUserCase } from './sa/use-cases/blogs/sa-bind-blog-with-user-case';
import { SA_GetAllBlogsCase } from './sa/use-cases/blogs/sa-get-all-blogs-case';
import { SA_BanUserCase } from './sa/use-cases/users/sa-ban-user-case';
import { ValidationBlogId } from './validation/validationBlogId';
import { GetAllCommentsByPostIdCase } from './public/use-cases/comment/get-all-comments-by-post-id-case';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { SA_CreateQuestionCase } from './quiz/sa/use-cases/sa-create-question-case';
import { SA_GetQuestionCase } from './quiz/sa/use-cases/sa-get-question-case';
import { QuestionSAController } from './quiz/sa/controllers/question.sa.controller';

import { SA_DeleteQuestionCase } from './quiz/sa/use-cases/sa-delete-question-case';
import { SA_UpdateQuestionCase } from './quiz/sa/use-cases/sa-update-question-case';
import { SA_UpdatePublishQuestionCase } from './quiz/sa/use-cases/sa-update-published-question-case';
import { Question } from './quiz/entities/question.entity';
import { QuestionRepository } from './quiz/repositories/question.quiz.repository';
import { CreateConnectionCase } from './quiz/public/use-cases/create-connection-case';
import { GetUnfinishedGameCase } from './quiz/public/use-cases/get-unfineshed-game-case';
import { PairRepository } from './quiz/repositories/pair.quiz.repository';
import { Pair } from './quiz/entities/pairs.entity';
import { Answer } from './quiz/entities/answer.entity';
import { PairController } from './quiz/public/controllers/pairs.public.controller';
import { GetGameByIdCase } from './quiz/public/use-cases/get-game-by-id-case';
import { CreateAnswerCase } from './quiz/public/use-cases/create-answer-case';
import { AnswerRepository } from './quiz/repositories/answer.quiz.repository';
import { GetAllGamesCase } from './quiz/public/use-cases/get-all-games-case';

const validations = [ValidationBlogId, ValidationLoginEmail];

const useCasesBlog = [
  CreateBlogCase,
  DeleteBlogCase,
  GetAllBlogsCase,
  GetBlogByBlogIdCase,
  GetCurrentUserBlogsCase,
  SA_BindBlogWithUserCase,
  SA_GetAllBlogsCase,
  UpdateBlogCase,
  SA_BanBlogCase,
];

const useCasesPost = [
  CreatePostByBlogIdCase,
  DeletePostCase,
  GetAllPostsByBlogIdCase,
  GetAllPostsCase,
  GetPostByIdCase,
  LikePostCase,
  UpdatePostCase,
];

const useCasesComment = [
  CreateCommentByBlogIdCase,
  DeleteCommentCase,
  GetAllPostsByBlogIdCase,
  GetCommentByCommentIdCase,
  GetCommentsWithPostInfoByUserIdCase,
  GetAllCommentsByPostIdCase,
  LikeCommentCase,
  UpdateCommentCase,
];

const useCasesSession = [
  DeleteAllSessionsWithoutCurrentCase,
  DeleteSessionByDeviceIdCase,
  GetAllSessionsCase,
];

const useCasesAuth = [
  ConfirmPasswordRecoveryCase,
  GetMeCase,
  GetNewTokensCase,
  LoginCase,
  LogoutCase,
  PasswordRecoveryCase,
  RegistrationCase,
  RegistrationConfirmationCase,
  ResendingEmailCase,
];

const useCasesUser = [
  BanUserForBlogByUserIdCase,
  SA_CreateUserCase,
  SA_GetAllUsersCase,
  SA_DeleteUserCase,
  SA_BanUserCase,
  GetBannedUsersByBlogIdCase,
];

const useCasesQuiz = [
  SA_GetQuestionCase,
  SA_CreateQuestionCase,
  SA_DeleteQuestionCase,
  SA_UpdateQuestionCase,
  SA_UpdatePublishQuestionCase,
  CreateConnectionCase,
  GetUnfinishedGameCase,
  GetGameByIdCase,
  CreateAnswerCase,
  GetAllGamesCase,
];

const strategies = [BasicStrategy, JwtStrategy, LocalStrategy];

@Module({
  imports: [
    /* для использования одноименной функции в nest, command bus */
    CqrsModule,

    /* и еще в провайдерах регистрировать каждую стратегию */
    PassportModule,

    /*почта */
    MailModule,

    /* главное, чтобы подтягивались env нужно вызвать сверху  */
    ConfigModule.forRoot({
      // no need to import into other modules
      isGlobal: true,
    }),
    //sql
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: +configService.get<number>('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        // ssl: true,
        entities: [
          User,
          Session,
          Blog,
          PostLike,
          Post,
          BanedUser,
          CommentLike,
          Comment,
          Question,
          Pair,
          Answer,
        ],
        autoLoadEntities: true,
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([
      User,
      BanedUser,
      Session,
      Blog,
      PostLike,
      Post,
      CommentLike,
      Comment,
      Question,
      Pair,
      Answer,
    ]),

    // ThrottlerModule.forRoot({
    //   ttl: 60,
    //   limit: 10,
    // }),
  ],
  controllers: [
    AppController,
    AuthController,
    BlogBloggersController,
    BlogController,
    BlogSAController,
    CommentBloggersController,
    CommentController,
    PostBloggersController,
    PostController,
    SessionsController,
    TestController,
    UserBloggersController,
    UserSAController,
    QuestionSAController,
    PairController,
  ],
  providers: [
    // {
    //   provide: APP_GUARD,
    //   useClass: ThrottlerGuard,
    // },
    ...strategies /* стратегия */,
    ...useCasesBlog /* кейсы */,
    ...useCasesComment /* кейсы */,
    ...useCasesPost /* кейсы */,
    ...useCasesSession /* кейсы */,
    ...useCasesUser /* кейсы */,
    ...useCasesAuth /* кейсы */,
    ...useCasesQuiz /* кейсы */,
    ...validations /*валидаторы */,
    AppService,
    BlogRepository,
    QuestionRepository,
    BlogQueryRepository,
    BanedUsersBlogsRepository,
    BanedUsersBlogsQueryRepository,
    CommentRepository,
    CommentQueryRepository,
    JWTService,
    JwtService,
    PostRepository,
    PostQueryRepository,
    LikePostRepository,
    LikeCommentRepository,
    SessionRepository,
    SessionService,
    UserRepository,
    UserQueryRepository,
    PairRepository,
    AnswerRepository,
  ],
})
export class AppModule {}
