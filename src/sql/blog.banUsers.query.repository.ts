import {
  BanedUser,
  getBannedUserViewModel,
} from '../entities/sql/blogsBannedUsers.entity';
import { In, Repository } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { ViewBannedUserDto } from '../blogger/dto/user/view-banned-user';
import { PaginationQuery } from '../pagination/base-pagination';
import { PaginatorBannedUsersViewModel } from '../pagination/paginatorType';

@Injectable()
export class BanedUsersBlogsQueryRepository {
  constructor(
    @InjectRepository(BanedUser)
    private readonly banedUsersRepository: Repository<BanedUser>,
  ) {}

  async findBannedUsersByBlogId(query: PaginationQuery, blogId: string) {
    const totalCount: number = await this.banedUsersRepository.count({
      relations: { blog: true, user: true },
      where: {
        blog: { id: blogId },
      },
    });

    const pagesCount = query.countPages(totalCount);
    if (query.sortBy === 'login') query.sortBy = 'userLogin';

    const usersFromDB: Array<BanedUser> = await this.banedUsersRepository.find({
      relations: { blog: true, user: true },
      where: {
        blog: { id: blogId },
      },
      // ошибка из за того, что тут нет дефолтного значения для сортировки
      order: {
        [query.sortBy]: query.sortDirection,
      },
      skip: query.skip(),
      take: query.pageSize,
    });

    const users: ViewBannedUserDto[] = usersFromDB.map((m) =>
      getBannedUserViewModel(m),
    );

    const result: PaginatorBannedUsersViewModel = {
      pagesCount: pagesCount,
      page: query.pageNumber,
      pageSize: query.pageSize,
      totalCount: totalCount,
      items: users,
    };
    return result;
  }
}
