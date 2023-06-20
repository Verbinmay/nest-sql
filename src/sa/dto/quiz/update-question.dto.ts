import {
  ArrayNotEmpty,
  IsArray,
  IsNotEmpty,
  IsString,
  Length,
} from 'class-validator';
import { Transform } from 'class-transformer';

import { CreateQuestionDto } from './create-question.dto';

export class UpdateQuestionDto extends CreateQuestionDto {}
