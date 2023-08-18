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
    try {
      return await this.blogsRepository.findOne({
        relations: {
          user: true,
          images: true,
        },
        where: { id: id },
      });
    } catch (error) {
      return null;
    }
  }

  async create(blog: Blog) {
    await this.blogsRepository.create(blog);
    return await this.blogsRepository.save(blog);
  }

  async update(blog: Blog): Promise<Blog> {
    return await this.blogsRepository.save(blog);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.blogsRepository.delete({ id: id });

    return result.affected > 0;
  }

  async deleteAll() {
    return await this.blogsRepository.delete({});
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
