import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { randomUUID } from 'crypto';
import { add } from 'date-fns';
import { join } from 'node:path/win32';

import { SAViewUserDto } from '../../sa/dto/user/sa-view-user.dto';
import { Pair } from '../../quiz/entities/pairs.entity';
import { Blog } from './blog.entity';
import { UserFollowBlog } from './userFollowBlog.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @Column({ length: 10 })
  public login: string;

  @Column()
  public email: string;

  @Column()
  public hash: string;

  @CreateDateColumn({ type: 'timestamp' })
  public createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  public updatedAt!: Date;

  @Column('uuid')
  confirmationCode: string = randomUUID();

  @Column('date')
  expirationDate: Date = add(new Date(), {
    hours: 1,
    minutes: 3,
  });
  @Column({ type: 'boolean', default: false })
  isConfirmed = false;

  @Column({ type: 'boolean', default: false })
  isBanned = false;

  @Column({ default: null, type: 'timestamp', nullable: true })
  banDate: Date | null;

  @Column({ type: 'text', nullable: true, default: null })
  banReason: string | null;

  @DeleteDateColumn()
  deletedAt: Date;

  @ManyToMany(() => Pair, {
    cascade: true,
    onDelete: 'SET NULL',
    onUpdate: 'SET NULL',
    nullable: true,
  })
  public Pair: Array<Pair>;

  @OneToMany(() => UserFollowBlog, (userFollowBlog) => userFollowBlog.user)
  public followBlog: Array<UserFollowBlog>;

  @Column({ type: 'bigint', nullable: true, default: null })
  telegramId: number | null;

  @Column({ type: 'boolean', nullable: true, default: false })
  telegramSpam: boolean;
}

export function SAGetViewModel(user: User): SAViewUserDto {
  const result = {
    id: user.id.toString(),
    login: user.login,
    email: user.email,
    createdAt: user.createdAt.toISOString(),
    banInfo: {
      isBanned: user.isBanned,
      banDate: user.banDate === null ? null : user.banDate.toISOString(),
      banReason: user.banReason === null ? null : user.banReason,
    },
  };
  return result;
}
