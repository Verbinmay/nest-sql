import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
@Index(['userId', 'blogId'], { unique: true })
export class BanedUser {
  @PrimaryGeneratedColumn('uuid')
  public id!: string;
  @Column('uuid')
  public userId: string;
  @Column()
  public userLogin: string;
  @Column()
  public banReason: string;
  @CreateDateColumn({ type: 'timestamp' })
  public banDate!: Date;
  @Column('uuid')
  public blogId: string;
}
export function getBannedUserViewModel(bannedUser: BanedUser) {
  return {
    id: bannedUser.userId,
    login: bannedUser.userLogin,
    banInfo: {
      isBanned: true,
      banDate: bannedUser.banDate.toISOString(),
      banReason: bannedUser.banReason,
    },
  };
}
