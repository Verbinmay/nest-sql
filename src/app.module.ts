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

const validations = [
  // ValidationBlogId
  ValidationLoginEmail,
];

// const useCasesBlog = [
//   CreateBlogCase,
//   DeleteBlogCase,
//   GetAllBlogsCase,
//   GetBlogByBlogIdCase,
//   GetCurrentUserBlogsCase,
//   SA_BindBlogWithUserCase,
//   SA_BanUserCase,
//   SA_CreateUserCase,
//   SA_DeleteUserCase,
//   SA_GetAllBlogsCase,
//   SA_GetAllUsersCase,
//   UpdateBlogCase,
//   SA_BanBlogCase,
// ];

// const useCasesPost = [
//   CreatePostByBlogIdCase,
//   DeletePostCase,
//   GetAllPostsByBlogIdCase,
//   GetAllPostsCase,
//   GetPostByIdCase,
//   LikePostCase,
//   UpdatePostCase,
// ];

// const useCasesComment = [
//   CreateCommentByBlogIdCase,
//   DeleteCommentCase,
//   GetAllCommentsByBlogIdCase,
//   GetCommentByCommentIdCase,
//   GetCommentsWithPostInfoByUserIdCase,
//   LikeCommentCase,
//   UpdateCommentCase,
// ];

// const useCasesSession = [
//   DeleteAllSessionsWithoutCurrentCase,
//   DeleteSessionByDeviceIdCase,
//   GetAllSessionsCase,
// ];

// const useCasesAuth = [
//   ConfirmPasswordRecoveryCase,
//   GetMeCase,
//   GetNewTokensCase,
//   LoginCase,
//   LogoutCase,
//   PasswordRecoveryCase,
//   RegistrationCase,
//   RegistrationConfirmationCase,
//   ResendingEmailCase,
// ];

const useCasesUser = [
  // BanUserForBlogByUserIdCase,
  SA_CreateUserCase,
  // GetBannedUsersByBlogIdCase,
];

// const strategies = [BasicStrategy, JwtStrategy, LocalStrategy];

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
        entities: [User],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([User]),
    // ThrottlerModule.forRoot({
    //   ttl: 60,
    //   limit: 10,
    // }),
  ],
  controllers: [
    // AppController,
    // AuthController,
    // BlogBloggersController,
    // BlogController,
    // BlogSAController,
    // CommentBloggersController,
    // CommentController,
    // PostBloggersController,
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
    // ...strategies /* стратегия */,
    // ...useCasesBlog /* кейсы */,
    // ...useCasesComment /* кейсы */,
    // ...useCasesPost /* кейсы */,
    // ...useCasesSession /* кейсы */,
    ...useCasesUser /* кейсы */,
    // ...useCasesAuth /* кейсы */,
    ...validations /*валидаторы */,
    // AppService,
    // AuthRepository,
    // BlogRepository,
    // CommentRepository,
    // JWTService,
    // JwtService,
    // PostRepository,
    // SessionRepository,
    // SessionService,
    UserRepository,
  ],
})
export class AppModule {}