import { Brackets, In, Like, Repository } from 'typeorm';

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
          login: Like('%' + query.searchLoginTerm + '%'),
        },
        {
          isBanned: In(query.createBanStatus()),
          email: Like('%' + query.searchEmailTerm + '%'),
        },
      ],
    });

    const pagesCount = query.countPages(totalCount);

    const usersFromDB: Array<User> = await this.usersRepository.find({
      where: [
        {
          isBanned: In(query.createBanStatus()),
          login: Like('%' + query.searchLoginTerm + '%'),
        },
        {
          isBanned: In(query.createBanStatus()),
          email: Like('%' + query.searchEmailTerm + '%'),
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

  // async findUserById(id: string): Promise<User> {
  //   try {
  //     return await this.UserModel.findById(id);
  //   } catch (error) {
  //     return null;
  //   }
  // }

  // async delete(id: string) {
  //   try {
  //     await this.UserModel.findByIdAndDelete(id);
  //     return true;
  //   } catch (error) {
  //     return false;
  //   }
  // }

  // async findUserByConfirmationCode(code: string) {
  //   const result: User | null = await this.UserModel.findOne({
  //     'emailConfirmation.confirmationCode': code,
  //   }).lean();
  //   return result;
  // }

  // async updateConfirmation(id: string) {
  //   try {
  //     const result = await this.UserModel.findById(id);

  //     if (!result) return false;

  //     result.emailConfirmation.isConfirmed = true;

  //     result.save();

  //     return true;
  //   } catch (e) {
  //     return false;
  //   }
  // }

  // async findUserByEmail(email: string) {
  //   try {
  //     return this.UserModel.findOne({
  //       email: email,
  //     });
  //   } catch (e) {
  //     return null;
  //   }
  // }

  // async updateConfirmationAndHash(a: { id: string; hash: string }) {
  //   try {
  //     const result = await this.UserModel.findById(a.id);

  //     if (!result) return false;

  //     result.emailConfirmation.isConfirmed = true;
  //     result.hash = a.hash;
  //     result.save();

  //     return true;
  //   } catch (e) {
  //     return false;
  //   }
  // }
}
