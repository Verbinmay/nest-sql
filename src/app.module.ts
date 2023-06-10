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
import { GetAllPostsByBlogIdCase } from './public/use-cases/post/get-post-by-blog-id-case';

const validations = [
  // ValidationBlogId
  ValidationLoginEmail,
];

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
  GetAllCommentsByBlogIdCase,
  GetCommentByCommentIdCase,
  GetCommentsWithPostInfoByUserIdCase,
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
        entities: [
          User,
          Session,
          Blog,
          PostLike,
          Post,
          BanedUser,
          CommentLike,
          Comment,
        ],
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
    ...validations /*валидаторы */,
    AppService,
    AuthRepository,
    BlogRepository,
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
  ],
})
export class AppModule {}
