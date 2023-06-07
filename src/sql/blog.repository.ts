import { Repository } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Blog } from '../entities/sql/blog.entity';

@Injectable()
export class BlogRepository {
  constructor(
    @InjectRepository(Blog) private readonly usersRepository: Repository<Blog>,
  ) {}

  async findBlogById(id: string): Promise<Blog> {
    return await this.usersRepository.findOneBy({ id: id });
  }

  async createBlog(blog: Blog) {
    await this.usersRepository.create(blog);
    return await this.usersRepository.save(blog);
  }

  async updateBlog(blog: Blog) {
    return await this.usersRepository.save(blog);
  }

  async delete(id: string) {
    return await this.usersRepository.delete({ id: id });
  }

  //   async findCountBlogs(filter: any) {
  //     return await this.BlogModel.countDocuments(filter);
  //   }

  //   async findBlogs(a: {
  //     find: { name: { $regex: string } } | object;
  //     sort: any;
  //     skip: number;
  //     limit: number;
  //   }) {
  //     const result: Array<Blog> = await this.BlogModel.find(a.find)
  //       .sort(a.sort)
  //       .skip(a.skip)
  //       .limit(a.limit);

  //     return result;
  //   }
}
