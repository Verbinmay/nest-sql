export class ViewQuestionDto {
  id: string | null;
  body: string | null;
  correctAnswers: Array<string> | null;
  published: boolean;
  createdAt: string;
  updatedAt: string | null;
}
