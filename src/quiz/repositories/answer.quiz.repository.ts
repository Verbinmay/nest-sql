import { Repository } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Answer } from '../entities/answer.entity';

@Injectable()
export class AnswerRepository {
  constructor(
    @InjectRepository(Answer)
    private readonly answerRepository: Repository<Answer>,
  ) {}

  async create(answer: Answer) {
    await this.answerRepository.create(answer);
    return await this.answerRepository.save(answer);
  }

  async update(answer: Answer) {
    return await this.answerRepository.save(answer);
  }

  async deleteAll() {
    return await this.answerRepository.delete({});
  }
}
