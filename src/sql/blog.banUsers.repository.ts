import { In, Repository } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { InjectRepository } from '@nestjs/typeorm';

import { BanedUser } from '../entities/sql/blogsBannedUsers.entity';
import { Post } from '../entities/sql/post.entity';
import { PostLikes } from '../entities/sql/post.like.entity';

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

  async findBanedUserByBlogId(blogId: string) {
    return await this.banedUsersRepository.findBy({ blogId: blogId });
  }

  async deleteBanedUserByBlogId(blogId: string) {
    return await this.banedUsersRepository.delete({ blogId: blogId });
  }
}
