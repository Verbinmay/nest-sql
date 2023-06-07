import { Repository } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Session } from '../entities/sql/session.entity';

@Injectable()
export class SessionRepository {
  constructor(
    @InjectRepository(Session)
    private readonly sessionsRepository: Repository<Session>,
  ) {}

  //   async findSessionsByUserId(userId: string) {
  //     return await this.SessionModel.find({ userId: userId });
  //   }

  async checkRefreshTokenEqual(a: {
    iat: number;
    deviceId: string;
    userId: string;
  }) {
    const result: Session | null = await this.sessionsRepository.findOne({
      where: {
        lastActiveDate: new Date(a.iat * 1000).toISOString(),
        deviceId: a.deviceId,
        userId: a.userId,
      },
    });
    return result != null;
  }

  //   async deleteAllWithoutCurrent(userId: string, deviceId: string) {
  //     try {
  //       await this.SessionModel.deleteMany({
  //         userId: userId,
  //         deviceId: { $ne: deviceId },
  //       });
  //       return true;
  //     } catch (error) {
  //       return false;
  //     }
  //   }
  //   async deleteAll(userId: string) {
  //     try {
  //       await this.SessionModel.deleteMany({
  //         userId: userId,
  //       });
  //       return true;
  //     } catch (error) {
  //       return false;
  //     }
  //   }

  //   async findSessionByDeviceId(deviceId: string) {
  //     const result: Session | null = await this.SessionModel.findOne({
  //       deviceId: deviceId,
  //     });
  //     return result;
  //   }

  //   async deleteSessionsByDeviceId(deviceId: string) {
  //     const result = await this.SessionModel.deleteOne({
  //       deviceId: deviceId,
  //     });
  //     return result.deletedCount === 1;
  //   }

  async save(session: Session) {
    await this.sessionsRepository.create(session);
    return await this.sessionsRepository.save(session);
  }

  //   async findSessionByDeviceIdAndUserId(deviceId: string, userId: string) {
  //     try {
  //       const result = await this.SessionModel.findOne({
  //         deviceId: deviceId,
  //         userId: userId,
  //       });
  //       return result;
  //     } catch (error) {
  //       return null;
  //     }
  //   }
}
