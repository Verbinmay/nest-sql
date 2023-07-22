import {
  PaginatorPair,
  PaginatorUserStatistic,
} from '../../pagination/paginatorType';
import { log } from 'console';
import { DataSource, EntityManager, In, Repository } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { User } from '../../entities/sql/user.entity';
import { PaginationQuery } from '../../pagination/base-pagination';
import { ViewPairDto } from '../public/dto/view-pair.dto';
import { UserStatisticDTO } from '../public/dto/view-user-statistic.dto';
import { GetAllPairViewModel, Pair } from '../entities/pairs.entity';

@Injectable()
export class PairRepository {
  constructor(
    @InjectRepository(Pair)
    private readonly pairRepository: Repository<Pair>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly dataSource: DataSource,
  ) {}

  async findPairs(userId: string, query: PaginationQuery) {
    // const totalCount: number = await this.pairRepository.count({
    //   where: [{ f_id: userId }, { s_id: userId }],
    // });

    const [pairsFromDB, totalCount] = await this.pairRepository.findAndCount({
      relations: { users: true, answers: true, questions: true },
      where: [{ f_id: userId }, { s_id: userId }],
      order: {
        [query.sortBy]: query.sortDirection,
        pairCreatedDate: 'DESC',
      },
      skip: query.skip(),
      take: query.pageSize,
    });

    const questions: ViewPairDto[] = pairsFromDB.map((m) =>
      GetAllPairViewModel(m),
    );

    const pagesCount = query.countPages(totalCount);

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
  async findStaticUsers(query: PaginationQuery) {
    const orderBy = query.sort.join(', ');
    const limit = query.pageSize;
    const offset = query.skip();

    const customSQLQuery = `SELECT  u.id,
    u.login,
    SUM(case WHEN u.id = pair.f_id THEN pair.f_score WHEN u.id = pair.s_id THEN pair.s_score end) AS sumscore,
    COUNT(*) AS gamescount,
    round(AVG(case WHEN u.id = pair.f_id THEN pair.f_score WHEN u.id = pair.s_id THEN pair.s_score end),2) AS avgscores,
    count (case WHEN u.id = pair.f_id AND pair.f_score > pair.s_score THEN 1 WHEN u.id = pair.s_id AND pair.s_score > pair.f_score THEN 1 end) AS winscount,
    count (case WHEN u.id = pair.f_id AND pair.f_score < pair.s_score THEN 1 WHEN u.id = pair.s_id AND pair.s_score < pair.f_score THEN 1 end) AS lossescount,
    count (case WHEN u.id = pair.f_id AND pair.f_score = pair.s_score THEN 1 WHEN u.id = pair.s_id AND pair.s_score = pair.f_score THEN 1 end) AS drawscount
    FROM "user" AS u
    LEFT OUTER JOIN pair_users_user
    ON (u.id = pair_users_user."userId")left outer
    JOIN pair
    ON (pair.id = pair_users_user."pairId")
    GROUP BY u.id
    ORDER BY ${orderBy}
    LIMIT $1
    OFFSET $2`;

    const statisticFromDB = await this.dataSource.query(customSQLQuery, [
      limit,
      offset,
    ]);

    const statisticView: Array<UserStatisticDTO> = statisticFromDB.map((s) => {
      return {
        player: {
          id: s.id,
          login: s.login,
        },
        sumScore: Number(s.sumscore),
        avgScores: (Number(s.avgscores) * 100) / 100,
        gamesCount: Number(s.gamescount),
        winsCount: Number(s.winscount),
        lossesCount: Number(s.lossescount),
        drawsCount: Number(s.drawscount),
      };
    });
    const totalCount: number = await this.userRepository.count({});
    const pagesCount = query.countPages(totalCount);
    const result: PaginatorUserStatistic = {
      pagesCount: pagesCount,
      page: query.pageNumber,
      pageSize: query.pageSize,
      totalCount: totalCount,
      items: statisticView,
    };

    return result;
  }
}
