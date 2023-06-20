import {
  ArrayNotEmpty,
  IsArray,
  IsNotEmpty,
  IsString,
  Length,
} from 'class-validator';
import { CreateQuestionDto } from './create-question.dto';

export class UpdateQuestionDto extends CreateQuestionDto {}
