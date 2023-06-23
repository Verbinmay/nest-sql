import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../entities/sql/user.entity';
import { ViewPairDto } from '../public/dto/view-pair.dto';
import { Answer } from './answer.entity';
import { Question } from './question.entity';

export type statusPair = 'PendingSecondPlayer' | 'Active' | 'Finished';

@Entity()
export class Pair {
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @ManyToMany(() => User, {
    cascade: true,
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinTable()
  public users: Array<User>;

  @OneToMany(() => Answer, (answer) => answer.pair)
  public answers: Array<Answer>;

  @Column('uuid')
  public f_id: string;
  @Column('number', { default: 0 })
  public f_score = 0;

  @Column('uuid', { nullable: true, default: null })
  public s_id: string = null;
  @Column('number')
  public s_score = 0;

  @ManyToMany(() => Question, {
    cascade: true,
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinTable()
  public questions: Array<Question>;

  @Column({
    type: 'enum',
    enum: ['PendingSecondPlayer', 'Active', 'Finished'],
    default: 'PendingSecondPlayer',
  })
  public status: statusPair = 'PendingSecondPlayer';

  @CreateDateColumn({ type: 'timestamp' })
  public pairCreatedDate: Date;

  @Column({ type: 'timestamp', default: null, nullable: true })
  public startGameDate: Date | null = null;

  @Column({ type: 'timestamp', default: null, nullable: true })
  public finishGameDate: Date | null = null;
}

export function GetPairViewModel(pair: Pair): ViewPairDto {
  const result = {
    id: pair.id,
    firstPlayerProgress: {
      answers:
        pair.answers.length > 0
          ? pair.answers
              .filter((a) => a.userId === pair.f_id)
              .map((a) => {
                return {
                  questionId: a.id,
                  answerStatus: a.answerStatus,
                  addedAt: a.addedAt.toISOString(),
                };
              })
          : [],

      player: {
        id: pair.f_id,
        login: pair.users.find((u) => u.id === pair.f_id).login,
      },
      score: pair.f_score,
    },
    secondPlayerProgress: {
      answers:
        pair.answers.length > 0
          ? pair.answers
              .filter((a) => a.userId === pair.s_id)
              .map((a) => {
                return {
                  questionId: a.id,
                  answerStatus: a.answerStatus,
                  addedAt: a.addedAt.toISOString(),
                };
              })
          : [],
      player: {
        id: pair.s_id,
        login: pair.users.find((u) => u.id === pair.s_id).login,
      },
      score: pair.s_score,
    },
    questions: pair.questions.map((q) => {
      return {
        id: q.id,
        body: q.body,
      };
    }),
    status: pair.status,
    pairCreatedDate: pair.pairCreatedDate.toISOString(),
    startGameDate: pair.startGameDate.toISOString(),
    finishGameDate: pair.finishGameDate.toISOString(),
  };
  return result;
}
// Если игра в статусе ожидания второго игрока (status: "PendingSecondPlayer") - поля secondPlayerProgress: null, questions: null, startGameDate: null, finishGameDate: null
export function GetNoPairViewModel(pair: Pair): ViewPairDto {
  const result = {
    id: pair.id,
    firstPlayerProgress: {
      answers: [],
      player: {
        id: pair.f_id,
        login: pair.users.find((u) => u.id === pair.f_id).login,
      },
      score: 0,
    },
    secondPlayerProgress: null,
    questions: null,
    status: pair.status,
    pairCreatedDate: pair.pairCreatedDate.toISOString(),
    startGameDate: null,
    finishGameDate: null,
  };
  return result;
}
