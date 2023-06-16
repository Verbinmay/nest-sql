import { Equal, Not, Repository } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Session } from '../entities/sql/session.entity';
import { User } from '../entities/sql/user.entity';

@Injectable()
export class SessionRepository {
  constructor(
    @InjectRepository(Session)
    private readonly sessionsRepository: Repository<Session>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findSessionsByUserId(userId: string) {
    try {
      return await this.sessionsRepository.find({
        relations: { user: true },
        where: { user: { id: userId } },
      });
    } catch (error) {
      return null;
    }
  }

  async checkRefreshTokenEqual(a: {
    iat: number;
    deviceId: string;
    userId: string;
  }) {
    const result: Session | null = await this.sessionsRepository.findOne({
      relations: { user: true },
      where: {
        lastActiveDate: new Date(a.iat * 1000).toISOString(),
        deviceId: a.deviceId,
        user: { id: a.userId },
      },
    });
    return result != null;
  }

  async deleteAllWithoutCurrent(userId: string, deviceId: string) {
    const result = await this.sessionsRepository.delete({
      user: { id: userId },
      deviceId: Not(Equal(deviceId)),
    });
    return result;
  }

  async deleteAllByUserId(userId: string) {
    await this.sessionsRepository.delete({
      user: { id: userId },
    });
    return true;
  }

  async findSessionByDeviceId(deviceId: string) {
    try {
      const result: Session | null = await this.sessionsRepository.findOne({
        relations: { user: true },
        where: {
          deviceId: deviceId,
        },
      });
      return result;
    } catch (error) {
      return null;
    }
  }

  async deleteSessionsByDeviceId(deviceId: string) {
    const result = await this.sessionsRepository.delete({
      deviceId: deviceId,
    });

    return result.affected > 0;
  }

  async create(session: Session) {
    await this.sessionsRepository.create(session);
    return await this.sessionsRepository.save(session);
  }
  async update(session: Session) {
    return await this.sessionsRepository.save(session);
  }

  async findSessionByDeviceIdAndUserId(deviceId: string, userId: string) {
    const result = await this.sessionsRepository.findOne({
      relations: { user: true },
      where: {
        deviceId: deviceId,
        user: { id: userId },
      },
    });
    return result;
  }

  async deleteAll() {
    return await this.sessionsRepository.delete({});
  }
}
