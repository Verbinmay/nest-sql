import { Repository } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Question } from '../entities/question.entity';

@Injectable()
export class QuestionRepository {
  constructor(
    @InjectRepository(Question)
    private readonly questionsRepository: Repository<Question>,
  ) {}

  // async findBlogById(id: string) {
  //   try {
  //     return await this.blogsRepository.findOne({
  //       relations: {
  //         user: true,
  //       },
  //       where: { id: id },
  //     });
  //   } catch (error) {
  //     return null;
  //   }
  // }

  async create(question: Question) {
    await this.questionsRepository.create(question);
    return await this.questionsRepository.save(question);
  }

  // async update(blog: Question): Promise<Question> {
  //   return await this.blogsRepository.save(blog);
  // }

  // async delete(id: string): Promise<boolean> {
  //   const result = await this.blogsRepository.delete({ id: id });

  //   return result.affected > 0;
  // }

  // async deleteAll() {
  //   return await this.blogsRepository.delete({});
  // }
}
