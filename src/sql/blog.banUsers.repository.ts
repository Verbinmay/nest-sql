import { Repository } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { BanedUser } from '../entities/sql/blogsBannedUsers.entity';

@Injectable()
export class BanedUsersBlogsRepository {
  constructor(
    @InjectRepository(BanedUser)
    private readonly banedUsersRepository: Repository<BanedUser>,
  ) {}

  async create(banedUser: BanedUser) {
    await this.banedUsersRepository.create(banedUser);
    return await this.banedUsersRepository.save(banedUser);
  }

  async findBanedUsersByBlogId(userId: string, blogId: string) {
    try {
      return await this.banedUsersRepository.findOne({
        relations: { user: true, blog: true },
        where: {
          user: { id: userId },
          blog: { id: blogId },
        },
      });
    } catch (error) {
      return null;
    }
  }

  async deleteBanedUserByBlogId(userId: string, blogId: string) {
    return await this.banedUsersRepository.delete({
      user: { id: userId },
      blog: { id: blogId },
    });
  }

  async deleteAll() {
    return await this.banedUsersRepository.delete({});
  }
}
