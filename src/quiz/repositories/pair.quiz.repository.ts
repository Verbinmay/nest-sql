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
        where: [
          { status: 'Active', f_id: userId },
          { status: 'Active', s_id: userId },
        ],
      });
    } catch (error) {
      return null;
    }
  }
  async findFullActivePair(userId: string) {
    try {
      return await this.pairRepository.findOne({
        relations: { users: true, answers: true, questions: true },
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
}
