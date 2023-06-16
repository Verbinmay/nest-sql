import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { ViewSessionDto } from '../../public/dto/session/view-session.dto';
import { User } from './user.entity';

@Entity()
export class Session {
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @Column()
  public ip: string;

  @Column()
  public title: string;

  @Column()
  public lastActiveDate: string;

  @Column()
  public expirationDate: string;

  @Column()
  public deviceId: string;

  // @Column('uuid')
  // public userId: string;

  @ManyToOne(() => User, { cascade: true, onDelete: 'CASCADE' })
  user: User;
}

export function getSessionViewModel(session: Session): ViewSessionDto {
  const result = {
    ip: session.ip,
    title: session.title,
    lastActiveDate: session.lastActiveDate,
    deviceId: session.deviceId,
  };
  return result;
}
