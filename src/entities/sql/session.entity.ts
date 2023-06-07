import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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

  @Column()
  public userId: string;

  // updateInfo(inputModel: any) {
  //   this.lastActiveDate = new Date(inputModel.iat * 1000).toISOString();
  //   this.expirationDate = new Date(inputModel.exp * 1000).toISOString();
  //   return this;
  // }

  // getViewModel(): ViewSessionDto {
  //   const result = {
  //     ip: this.ip,
  //     title: this.title,
  //     lastActiveDate: this.lastActiveDate,
  //     deviceId: this.deviceId,
  //   };
  //   return result;
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

// export const SessionSchema = SchemaFactory.createForClass(Session);

// SessionSchema.methods = {
//   updateInfo: Session.prototype.updateInfo,
//   getViewModel: Session.prototype.getViewModel,
// };

// SessionSchema.statics = {
//   createSession: Session.createSession,
// };

// export type SessionDocument = HydratedDocument<Session>;

// export type SessionModelStaticType = {
//   createSession: (inputModel: CreateSessionDto) => SessionDocument;
// };
// export type SessionModelMethodsType = {
//   updateInfo: (inputModel: any) => Session;
//   getViewModel: () => ViewSessionDto;
// };

// export type SessionModelType = Model<SessionDocument> &
//   SessionModelStaticType &
//   SessionModelMethodsType;
