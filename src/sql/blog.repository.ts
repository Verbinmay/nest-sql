import { Repository } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Blog } from '../entities/sql/blog.entity';

@Injectable()
export class BlogRepository {
  constructor(
    @InjectRepository(Blog) private readonly blogsRepository: Repository<Blog>,
  ) {}

  async findBlogById(id: string) {
    return await this.blogsRepository.findOneBy({ id: id });
  }

  async create(blog: Blog) {
    await this.blogsRepository.create(blog);
    return await this.blogsRepository.save(blog);
  }

  async update(blog: Blog) {
    return await this.blogsRepository.save(blog);
  }

  async delete(id: string) {
    return await this.blogsRepository.delete({ id: id });
  }

  async truncate(): Promise<void> {
    return await this.blogsRepository.clear();
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
