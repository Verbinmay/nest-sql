import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ViewAnswerDto } from '../public/dto/view-answer.dto';
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

export function GetAnswerViewModel(answer: Answer): ViewAnswerDto {
  const result = {
    questionId: answer.questionId,
    answerStatus: answer.answerStatus,
    addedAt: answer.addedAt.toISOString(),
  };
  return result;
}
