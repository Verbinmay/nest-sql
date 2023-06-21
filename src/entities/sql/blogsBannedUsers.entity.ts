import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Blog } from './blog.entity';
import { User } from './user.entity';

@Entity()
// @Index(['userId', 'blogId'], { unique: true })
export class BanedUser {
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  // @Column('uuid')
  // public userId: string;
  // @Column()
  // public userLogin: string;
  @ManyToOne(() => User, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  user: User;

  @Column()
  public banReason: string;
  @CreateDateColumn({ type: 'timestamp' })
  public banDate!: Date;

  // @Column('uuid')
  // public blogId: string;
  @ManyToOne(() => Blog, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  blog: Blog;

  //TODO
  @CreateDateColumn({ type: 'timestamp' })
  public createdAt: Date;
}
export function getBannedUserViewModel(bannedUser: BanedUser) {
  return {
    id: bannedUser.user.id,
    login: bannedUser.user.login,
    banInfo: {
      isBanned: true,
      banDate: bannedUser.banDate.toISOString(),
      banReason: bannedUser.banReason,
    },
  };
}
