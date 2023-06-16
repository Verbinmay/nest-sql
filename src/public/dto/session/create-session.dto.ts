import { User } from '../../../entities/sql/user.entity';

export class CreateSessionDto {
  iat: number;
  expirationDate: number;
  ip: string;
  title: string;
  deviceId: string;
  user: User;
}
