import { EntityManager, ILike, In, Repository } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Pair } from '../entities/pairs.entity';

@Injectable()
export class PairRepository {
  constructor(
    @InjectRepository(Pair)
    private readonly pairRepository: Repository<Pair>,
  ) {}

  async findFreePair(queryRunnerManager: EntityManager) {
    try {
      return await queryRunnerManager.findOne(Pair, {
        transaction: true,
        // lock: { mode: '' },
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
  async findMyCurrentGame(userId: string) {
    try {
      return await this.pairRepository.findOne({
        relations: { users: true, answers: true, questions: true },
        where: [
          { status: In(['Active', 'PendingSecondPlayer']), s_id: userId },
          { status: In(['Active', 'PendingSecondPlayer']), f_id: userId },
        ],
      });
    } catch (error) {
      return null;
    }
  }

  async create(pair: Pair, queryRunnerManager?: EntityManager) {
    if (queryRunnerManager) {
      await queryRunnerManager.create(Pair, pair);
      return await queryRunnerManager.save(Pair, pair);
    }
    await this.pairRepository.create(pair);
    return await this.pairRepository.save(pair);
  }

  async update(pair: Pair, queryRunnerManager?: EntityManager): Promise<Pair> {
    if (queryRunnerManager) {
      return await queryRunnerManager.save(Pair, pair);
    }
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

  async findGameById(id: string) {
    try {
      return await this.pairRepository.findOne({
        relations: { users: true, answers: true, questions: true },
        where: { id: id },
      });
    } catch (error) {
      return null;
    }
  }

  // async delete(id: string): Promise<boolean> {
  //   const result = await this.questionsRepository.delete({ id: id });

  //   return result.affected > 0;
  // }

  async deleteAll() {
    return await this.pairRepository.delete({});
  }
}
