import { ViewBlogDto } from '../blogger/dto/blog/view-blog.dto';
import { ViewCommentWithPostInfoDto } from '../blogger/dto/comment/view-comment-with-post-info.dto';
import { ViewBannedUserDto } from '../blogger/dto/user/view-banned-user';
import { ViewCommentDto } from '../public/dto/comment/view-comment.dto';
import { ViewPostDto } from '../public/dto/post/view-post.dto';
import { ViewPairDto } from '../quiz/public/dto/view-pair.dto';
import { ViewQuestionDto } from '../quiz/sa/dto/view-question.dto';
import { SAViewBlogDto } from '../sa/dto/blog/sa-view-blog.dto';
import { SAViewUserDto } from '../sa/dto/user/sa-view-user.dto';

export type PaginatorEnd = {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
};

export type PaginatorBlog = PaginatorEnd & {
  items: Array<ViewBlogDto> | Array<SAViewBlogDto>;
};

export type PaginatorPost = PaginatorEnd & {
  items: Array<ViewPostDto>;
};

export type PaginatorUser = PaginatorEnd & {
  items: Array<SAViewUserDto>;
};

export type PaginatorQuestion = PaginatorEnd & {
  items: Array<ViewQuestionDto>;
};
export type PaginatorPair = PaginatorEnd & {
  items: Array<ViewPairDto>;
};

export type PaginatorCommentWithLikeViewModel = PaginatorEnd & {
  items: Array<ViewCommentDto>;
};
export type PaginatorCommentWithWithPostInfoViewModel = PaginatorEnd & {
  items: Array<ViewCommentWithPostInfoDto>;
};
export type PaginatorBannedUsersViewModel = PaginatorEnd & {
  items: Array<ViewBannedUserDto>;
};

export const sortDirectionVariates = ['ASC', 'DESC'];
export const sortingByVariates = [
  'id',
  'name',
  'description',
  'websiteUrl',
  'isMembership',
  'userId',
  'userLogin',
  'title',
  'blogId',
  'blogName',
  'likesCount',
  'dislikesCount',
  'login',
  'isBanned',
  'banDate',
  'banReason',
  'createdAt',
  'shortDescription',
  'content',
  'addedAt',
  'ip',
  'lastActiveDate',
  'deviceId',
  'email',
  'body',
  'correctAnswers',
  'published',
  'updatedAt',
  'status',
  'pairCreatedDate',
  'startGameDate',
  'finishGameDate',
  'sumScore',
  'avgScores',
  'gamesCount',
  'winsCount',
  'lossesCount',
  'drawsCount',
];
export const banStatusVariates = ['all', 'banned', 'notBanned'];
export const publishedStatusVariates = ['all', 'published', 'notPublished'];
