import { GetAllPairViewModel, Pair } from '../entities/pairs.entity';
import { EntityManager, In, Repository } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { PaginationQuery } from '../../pagination/base-pagination';
import { PaginatorPair } from '../../pagination/paginatorType';
import { ViewPairDto } from '../public/dto/view-pair.dto';

@Injectable()
export class PairRepository {
  constructor(
    @InjectRepository(Pair)
    private readonly pairRepository: Repository<Pair>,
  ) {}

  async findPairs(userId: string, query: PaginationQuery) {
    const totalCount: number = await this.pairRepository.count({
      where: [{ f_id: userId }, { s_id: userId }],
    });

    const pagesCount = query.countPages(totalCount);

    let orderInfo: any = {
      [query.sortBy]: query.sortDirection,
      // pairCreatedDate: 'DESC',
    };

    if (query.sortBy === 'createdAt') {
      orderInfo = { pairCreatedDate: query.sortDirection };
    }

    const pairsFromDB: Array<Pair> = await this.pairRepository.find({
      relations: { users: true, answers: true, questions: true },
      where: [{ f_id: userId }, { s_id: userId }],
      order:
        // orderInfo,
        {
          [query.sortBy]: query.sortDirection,
          pairCreatedDate: 'DESC',
          // questions: { createdAt: 'ASC' },
          // answers: { addedAt: 'ASC' },
        },
      skip: query.skip(),
      take: query.pageSize,
    });

    const questions: ViewPairDto[] = pairsFromDB.map((m) =>
      GetAllPairViewModel(m),
    );

    const result: PaginatorPair = {
      pagesCount: pagesCount,
      page: query.pageNumber,
      pageSize: query.pageSize,
      totalCount: totalCount,
      items: questions,
    };
    return result;
  }

  async findFreePair(queryRunnerManager: EntityManager) {
    try {
      return await queryRunnerManager.findOne(Pair, {
        transaction: true,
        lock: {
          mode: 'pessimistic_write',
          tables: ['pair'],
          onLocked: 'nowait',
        },
        relations: { users: true, answers: true, questions: true },
        where: { status: 'PendingSecondPlayer' },
        order: {
          questions: { createdAt: 'ASC' },
        },
      });
    } catch (error) {
      return null;
    }
  }

  async findActivePair(userId: string) {
    try {
      return await this.pairRepository.findOne({
        where: [
          { status: 'Active', f_id: userId },
          { status: 'Active', s_id: userId },
        ],
      });
    } catch (error) {
      return null;
    }
  }
  //TODO lock
  async findFullActivePair(userId: string) {
    try {
      return await this.pairRepository.findOne({
        relations: { users: true, answers: true, questions: true },
        // lock
        where: [
          { status: 'Active', f_id: userId },
          { status: 'Active', s_id: userId },
        ],
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

  async deleteAll() {
    return await this.pairRepository.delete({});
  }
  async findAllRawPairsById(userId: string) {
    return await this.pairRepository.find({
      where: [{ f_id: userId }, { s_id: userId }],
    });
  }
}
