import { ViewBlogDto } from '../blogger/dto/blog/view-blog.dto';
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

// export type PaginatorPost = PaginatorEnd & {
//   items: Array<ViewPostDto>;
// };

export type PaginatorUser = PaginatorEnd & {
  items: Array<SAViewUserDto>;
};

// export type PaginatorCommentWithLikeViewModel = PaginatorEnd & {
//   items: Array<ViewCommentDto>;
// };
// export type PaginatorCommentWithWithPostInfoViewModel = PaginatorEnd & {
//   items: Array<ViewCommentWithPostInfoDto>;
// };
// export type PaginatorBannedUsersViewModel = PaginatorEnd & {
//   items: Array<ViewBannedUserDto>;
// };
