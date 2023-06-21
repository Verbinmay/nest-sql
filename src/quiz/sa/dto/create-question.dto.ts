import { ArrayNotEmpty, IsArray, IsString, Length } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateQuestionDto {
  @IsString()
  @Transform(({ value }) => {
    if (typeof value === 'number') {
      return false;
    }
    return value.trim();
  })
  @Length(10, 500)
  body: string;

  @IsArray()
  @ArrayNotEmpty()
  @Transform(({ value }) => {
    if (!Array.isArray(value)) {
      return false;
    }
    return value.map((item: string | number | boolean) =>
      item.toString().trim(),
    );
  })
  correctAnswers: Array<string>;
}
