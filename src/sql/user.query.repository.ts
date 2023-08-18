import { ILike, In, Repository } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { SAViewUserDto } from '../sa/dto/user/sa-view-user.dto';
import { SAGetViewModel, User } from '../entities/sql/user.entity';
import { PaginationQuery } from '../pagination/base-pagination';
import { PaginatorUser } from '../pagination/paginatorType';

@Injectable()
export class UserQueryRepository {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
  ) {}

  async SA_findUsers(query: PaginationQuery) {
    const totalCount: number = await this.usersRepository.count({
      where: [
        {
          isBanned: In(query.createBanStatus()),
          login: ILike('%' + query.searchLoginTerm + '%'),
        },
        {
          isBanned: In(query.createBanStatus()),
          email: ILike('%' + query.searchEmailTerm + '%'),
        },
      ],
    });

    const pagesCount = query.countPages(totalCount);

    const usersFromDB: Array<User> = await this.usersRepository.find({
      where: [
        {
          isBanned: In(query.createBanStatus()),
          login: ILike('%' + query.searchLoginTerm + '%'),
        },
        {
          isBanned: In(query.createBanStatus()),
          email: ILike('%' + query.searchEmailTerm + '%'),
        },
      ],
      order: {
        [query.sortBy]: query.sortDirection,
      },
      skip: query.skip(),
      take: query.pageSize,
    });

    const users: SAViewUserDto[] = usersFromDB.map((m) => SAGetViewModel(m));

    const result: PaginatorUser = {
      pagesCount: pagesCount,
      page: query.pageNumber,
      pageSize: query.pageSize,
      totalCount: totalCount,
      items: users,
    };
    return result;
  }
}
