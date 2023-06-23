import { ILike, In, Repository } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { PaginationQuery } from '../../pagination/base-pagination';
import { PaginatorQuestion } from '../../pagination/paginatorType';
import { Pair } from '../entities/pairs.entity';

@Injectable()
export class PairRepository {
  constructor(
    @InjectRepository(Pair)
    private readonly pairRepository: Repository<Pair>,
  ) {}

  async findFreePair() {
    try {
      return await this.pairRepository.findOne({
        relations: { users: true, answers: true, questions: true },
        where: { status: 'PendingSecondPlayer' },
      });
    } catch (error) {
      return null;
    }
  }

  async findActivePair(userId: string) {
    try {
      return await this.pairRepository.findOne({
        where: { status: 'Active', f_id: userId },
      });
    } catch (error) {
      return null;
    }
  }

  async create(pair: Pair) {
    await this.pairRepository.create(pair);
    return await this.pairRepository.save(pair);
  }

  async update(pair: Pair): Promise<Pair> {
    return await this.pairRepository.save(pair);
  }

  // async findQuestions(query: PaginationQuery) {
  //   const totalCount: number = await this.questionsRepository.count({
  //     where: {
  //       body: ILike('%' + query.bodySearchTerm + '%'),
  //       published: In(query.createPublishedStatus()),
  //     },
  //   });

  //   const pagesCount = query.countPages(totalCount);

  //   const questionsFromDB: Array<Question> =
  //     await this.questionsRepository.find({
  //       where: {
  //         body: ILike('%' + query.bodySearchTerm + '%'),
  //         published: In(query.createPublishedStatus()),
  //       },
  //       order: {
  //         [query.sortBy]: query.sortDirection,
  //       },
  //       skip: query.skip(),
  //       take: query.pageSize,
  //     });

  //   const questions: ViewQuestionDto[] = questionsFromDB.map((m) =>
  //     SA_GetQuestionViewModel(m),
  //   );

  //   const result: PaginatorQuestion = {
  //     pagesCount: pagesCount,
  //     page: query.pageNumber,
  //     pageSize: query.pageSize,
  //     totalCount: totalCount,
  //     items: questions,
  //   };
  //   return result;
  // }

  // async findQuestionById(id: string) {
  //   try {
  //     return await this.questionsRepository.findOne({
  //       where: { id: id },
  //     });
  //   } catch (error) {
  //     return null;
  //   }
  // }

  // async delete(id: string): Promise<boolean> {
  //   const result = await this.questionsRepository.delete({ id: id });

  //   return result.affected > 0;
  // }

  // async deleteAll() {
  //   return await this.questionsRepository.delete({});
  // }
}
