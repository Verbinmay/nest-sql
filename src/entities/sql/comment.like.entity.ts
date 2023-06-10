import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  Column,
} from 'typeorm';

export type statusLikeEnum = 'Like' | 'Dislike';

@Entity()
export class CommentLike {
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @CreateDateColumn({ type: 'timestamp' })
  public addedAt: Date;

  @Column()
  public login: string;

  @Column('uuid')
  public userId: string;

  @Column('uuid')
  public commentId: string;

  @Column({ type: 'enum', enum: ['Like', 'Dislike'] })
  public status: statusLikeEnum;

  @Column({ type: 'boolean', default: false })
  public isBanned = false;
}
