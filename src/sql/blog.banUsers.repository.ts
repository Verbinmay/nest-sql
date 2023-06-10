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
    return await this.banedUsersRepository.findOneBy({
      userId: userId,
      blogId: blogId,
    });
  }

  async deleteBanedUserByBlogId(userId: string, blogId: string) {
    return await this.banedUsersRepository.delete({
      userId: userId,
      blogId: blogId,
    });
  }

  async truncate(): Promise<void> {
    return await this.banedUsersRepository.clear();
  }
}
