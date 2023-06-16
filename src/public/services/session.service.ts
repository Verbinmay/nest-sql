import { Injectable } from '@nestjs/common';

import { Session } from '../../entities/sql/session.entity';
import { JWTService } from '../../jwt/jwt.service';
import { SessionRepository } from '../../sql/sessions.repository';
import { CreateSessionDto } from '../dto/session/create-session.dto';

@Injectable()
export class SessionService {
  constructor(
    private readonly sessionRepository: SessionRepository,
    private readonly jwtService: JWTService,
  ) {}

  async createSession(inputModel: CreateSessionDto) {
    try {
      const session = new Session();
      session.ip = inputModel.ip;
      session.title = inputModel.title;
      session.lastActiveDate = new Date(inputModel.iat * 1000).toISOString();
      session.expirationDate = new Date(inputModel.iat * 1000).toISOString();
      session.deviceId = inputModel.deviceId;
      session.user = inputModel.user;
      await this.sessionRepository.create(session);
      return true;
    } catch (error) {
      return false;
    }
  }

  async changeRefreshTokenInfo(a: { newToken: string; iatOldSession: number }) {
    try {
      const decoded = await this.jwtService.decoderJWTs(a.newToken);
      if (typeof decoded === 'string') {
        return false;
      }
      const session: Session | null =
        await this.sessionRepository.findSessionByDeviceIdAndUserId(
          decoded.deviceId,
          decoded.sub,
        );
      if (!session) {
        return false;
      }

      session.lastActiveDate = new Date(decoded.iat * 1000).toISOString();
      session.expirationDate = new Date(decoded.exp * 1000).toISOString();

      await this.sessionRepository.update(session);
      return true;
    } catch (error) {
      return false;
    }
  }
}
