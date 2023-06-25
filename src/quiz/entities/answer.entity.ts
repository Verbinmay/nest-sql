import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Pair } from './pairs.entity';

export type answerStatus = 'Correct' | 'Incorrect';
@Entity()
export class Answer {
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @Column('uuid')
  public userId: string;

  @Column('uuid')
  public questionId: string;

  @Column({ type: 'enum', enum: ['Correct', 'Incorrect'] })
  public answerStatus: answerStatus;

  @CreateDateColumn({ type: 'timestamp' })
  public addedAt: Date;

  @ManyToOne(() => Pair, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  public pair: Pair;
}
