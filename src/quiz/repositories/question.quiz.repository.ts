import { ILike, In, Repository } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { PaginationQuery } from '../../pagination/base-pagination';
import { PaginatorQuestion } from '../../pagination/paginatorType';
import { ViewQuestionDto } from '../sa/dto/view-question.dto';
import { Question, SA_GetQuestionViewModel } from '../entities/question.entity';

@Injectable()
export class QuestionRepository {
  constructor(
    @InjectRepository(Question)
    private readonly questionsRepository: Repository<Question>,
  ) {}

  async findQuestions(query: PaginationQuery) {
    const totalCount: number = await this.questionsRepository.count({
      where: {
        body: ILike('%' + query.bodySearchTerm + '%'),
        published: In(query.createPublishedStatus()),
      },
    });

    const pagesCount = query.countPages(totalCount);

    const questionsFromDB: Array<Question> =
      await this.questionsRepository.find({
        where: {
          body: ILike('%' + query.bodySearchTerm + '%'),
          published: In(query.createPublishedStatus()),
        },
        order: {
          [query.sortBy]: query.sortDirection,
        },
        skip: query.skip(),
        take: query.pageSize,
      });

    const questions: ViewQuestionDto[] = questionsFromDB.map((m) =>
      SA_GetQuestionViewModel(m),
    );

    const result: PaginatorQuestion = {
      pagesCount: pagesCount,
      page: query.pageNumber,
      pageSize: query.pageSize,
      totalCount: totalCount,
      items: questions,
    };
    return result;
  }

  async findQuestionById(id: string) {
    try {
      return await this.questionsRepository.findOne({
        where: { id: id },
      });
    } catch (error) {
      return null;
    }
  }

  async create(question: Question) {
    await this.questionsRepository.create(question);
    return await this.questionsRepository.save(question);
  }

  async update(question: Question): Promise<Question> {
    return await this.questionsRepository.save(question);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.questionsRepository.delete({ id: id });

    return result.affected > 0;
  }

  async deleteAll() {
    return await this.questionsRepository.delete({});
  }

  async findRandomQuestions() {
    const questionsFromDB: Array<Question> = await this.questionsRepository
      .createQueryBuilder('question')
      .where('question.published = true')
      .addOrderBy('RANDOM()')
      .take(5)
      .getMany();

    return questionsFromDB;
  }
}
