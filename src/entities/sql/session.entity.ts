import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

import { ViewSessionDto } from '../../public/dto/session/view-session.dto';

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

  @Column('uuid')
  public userId: string;
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
