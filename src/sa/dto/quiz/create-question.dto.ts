import {
  ArrayNotEmpty,
  IsArray,
  IsNotEmpty,
  IsString,
  Length,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateQuestionDto {
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }): string => value.trim())
  @Length(10, 500)
  body: string;

  @IsArray()
  @ArrayNotEmpty()
  @Transform(
    ({ value }): Array<string> =>
      value.forEach((item: string | number | boolean) =>
        item.toString().trim(),
      ),
  )
  correctAnswers: Array<string>;
}
