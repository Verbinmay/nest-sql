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
import { LoginCase } from './public/use-cases/login-case';
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
import { PostLikes } from './entities/sql/post.like.entity';
import { Post } from './entities/sql/post.entity';
import { CreatePostByBlogIdCase } from './blogger/use-cases/post/create-post-by-blog-id-case';
import { PostBloggersController } from './blogger/controllers/post.blogger.controller';
import { LikePostRepository } from './sql/post.like.repository';
import { PostRepository } from './sql/post.repository';
import { UpdatePostCase } from './blogger/use-cases/post/update-post-case';

const validations = [
  // ValidationBlogId
  ValidationLoginEmail,
];

const useCasesBlog = [
  CreateBlogCase,
  DeleteBlogCase,
  //   GetAllBlogsCase,
  //   GetBlogByBlogIdCase,
  GetCurrentUserBlogsCase,
  //   SA_BindBlogWithUserCase,
  //
  //   SA_GetAllBlogsCase,
  UpdateBlogCase,
  //   SA_BanBlogCase,
];

const useCasesPost = [
  CreatePostByBlogIdCase,
  //   DeletePostCase,
  //   GetAllPostsByBlogIdCase,
  //   GetAllPostsCase,
  //   GetPostByIdCase,
  //   LikePostCase,
  UpdatePostCase,
];

// const useCasesComment = [
//   CreateCommentByBlogIdCase,
//   DeleteCommentCase,
//   GetAllCommentsByBlogIdCase,
//   GetCommentByCommentIdCase,
//   GetCommentsWithPostInfoByUserIdCase,
//   LikeCommentCase,
//   UpdateCommentCase,
// ];

const useCasesSession = [
  //   DeleteAllSessionsWithoutCurrentCase,
  //   DeleteSessionByDeviceIdCase,
  //   GetAllSessionsCase,
];

const useCasesAuth = [
  //   ConfirmPasswordRecoveryCase,
  //   GetMeCase,
  //   GetNewTokensCase,
  LoginCase,
  //   LogoutCase,
  //   PasswordRecoveryCase,
  //   RegistrationCase,
  //   RegistrationConfirmationCase,
  //   ResendingEmailCase,
];

const useCasesUser = [
  // BanUserForBlogByUserIdCase,
  SA_CreateUserCase,
  SA_GetAllUsersCase,
  SA_DeleteUserCase,
  // SA_BanUserCase,
  // GetBannedUsersByBlogIdCase,
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
        entities: [User, Session, Blog, PostLikes, Post],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([User, Session, Blog, PostLikes, Post]),

    // ThrottlerModule.forRoot({
    //   ttl: 60,
    //   limit: 10,
    // }),
  ],
  controllers: [
    AppController,
    AuthController,
    BlogBloggersController,
    // BlogController,
    // BlogSAController,
    // CommentBloggersController,
    // CommentController,
    PostBloggersController,
    // PostController,
    // SessionsController,
    // TestController,
    // UserBloggersController,
    UserSAController,
  ],
  providers: [
    // {
    //   provide: APP_GUARD,
    //   useClass: ThrottlerGuard,
    // },
    ...strategies /* стратегия */,
    ...useCasesBlog /* кейсы */,
    // ...useCasesComment /* кейсы */,
    ...useCasesPost /* кейсы */,
    ...useCasesSession /* кейсы */,
    ...useCasesUser /* кейсы */,
    ...useCasesAuth /* кейсы */,
    ...validations /*валидаторы */,
    AppService,
    // AuthRepository,
    BlogRepository,
    BlogQueryRepository,
    // CommentRepository,
    JWTService,
    JwtService,
    PostRepository,
    LikePostRepository,
    SessionRepository,
    SessionService,
    UserRepository,
    UserQueryRepository,
  ],
})
export class AppModule {}
