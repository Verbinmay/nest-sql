import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ViewQuestionDto } from '../dto/view-question.dto';

@Entity()
export class Question {
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @Column({ length: 500 })
  public body: string;

  @Column('simple-json')
  public answers: Array<string>;

  @CreateDateColumn({ type: 'timestamp' })
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;

  @Column({ type: 'boolean', default: false })
  public published = false;
}

export function SA_GetQuestionViewModel(question: Question): ViewQuestionDto {
  const result = {
    id: question.id,
    body: question.body,
    correctAnswers: question.answers,
    published: question.published,
    createdAt: question.createdAt.toISOString(),
    updatedAt: question.updatedAt.toISOString(),
  };
  return result;
}
