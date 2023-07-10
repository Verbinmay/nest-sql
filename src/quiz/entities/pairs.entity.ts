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
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    nullable: true,
  })
  @JoinTable()
  public users: Array<User>;

  @OneToMany(() => Answer, (answer) => answer.pair)
  public answers: Array<Answer>;

  @Column('uuid')
  public f_id: string;
  @Column('integer', { default: 0 })
  public f_score = 0;

  @Column('uuid', { nullable: true, default: null })
  public s_id: string = null;
  @Column('integer')
  public s_score = 0;

  @ManyToMany(() => Question, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    nullable: true,
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
  // if (pair.s_id === null) {
  //   const result = {
  //     id: pair.id,
  //     firstPlayerProgress: {
  //       answers: [],
  //       player: {
  //         id: pair.f_id,
  //         login: pair.users.find((u) => u.id === pair.f_id).login,
  //       },
  //       score: 0,
  //     },
  //     secondPlayerProgress: null,
  //     questions: null,
  //     status: pair.status,
  //     pairCreatedDate: pair.pairCreatedDate.toISOString(),
  //     startGameDate: null,
  //     finishGameDate: null,
  //   };
  //   return result;
  // } else {
  const result = {
    id: pair.id,
    firstPlayerProgress: {
      answers:
        pair.answers.length > 0
          ? pair.answers
              .filter((a) => a.userId === pair.f_id)
              .map((a) => {
                return {
                  questionId: a.questionId,
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
                  questionId: a.questionId,
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
    finishGameDate: pair.finishGameDate
      ? pair.finishGameDate.toISOString()
      : null,
  };
  return result;
}

// Если игра в статусе ожидания второго игрока (status: "PendingSecondPlayer") - поля secondPlayerProgress: null, questions: null, startGameDate: null, finishGameDate: null
/**УЖЕ БЕСПОЛЕЗНА, НО НЕ ВЫВЕДЕНА ИЗ ПРОЕКТА*/
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

export function GetAllPairViewModel(pair: Pair): ViewPairDto {
  if (pair.status === 'PendingSecondPlayer') {
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
  } else {
    const result = {
      id: pair.id,
      firstPlayerProgress: {
        answers:
          pair.answers.length > 0
            ? pair.answers
                .filter((a) => a.userId === pair.f_id)
                .map((a) => {
                  return {
                    questionId: a.questionId,
                    answerStatus: a.answerStatus,
                    addedAt: a.addedAt.toISOString(),
                  };
                })
                .sort((a, b) => a.addedAt.localeCompare(b.addedAt))
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
                    questionId: a.questionId,
                    answerStatus: a.answerStatus,
                    addedAt: a.addedAt.toISOString(),
                  };
                })
                .sort((a, b) => a.addedAt.localeCompare(b.addedAt))
            : [],
        player: {
          id: pair.s_id,
          login: pair.users.find((u) => u.id === pair.s_id).login,
        },
        score: pair.s_score,
      },
      questions: pair.questions
        .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
        .map((q) => {
          return {
            id: q.id,
            body: q.body,
          };
        }),
      status: pair.status,
      pairCreatedDate: pair.pairCreatedDate.toISOString(),
      startGameDate: pair.startGameDate.toISOString(),
      finishGameDate: pair.finishGameDate
        ? pair.finishGameDate.toISOString()
        : null,
    };
    return result;
  }
}
