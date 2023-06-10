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

  // updateInfo(inputModel: any) {
  //   this.lastActiveDate = new Date(inputModel.iat * 1000).toISOString();
  //   this.expirationDate = new Date(inputModel.exp * 1000).toISOString();
  //   return this;
  // }

  // static createSession(inputModel: CreateSessionDto): Session {
  //   const session = new Session();
  //   session.ip = inputModel.ip;
  //   session.title = inputModel.title;
  //   session.lastActiveDate = new Date(inputModel.iat * 1000).toISOString();
  //   session.expirationDate = new Date(inputModel.iat * 1000).toISOString();
  //   session.deviceId = inputModel.deviceId;
  //   session.userId = inputModel.userId;

  //   return session;
  // }
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
