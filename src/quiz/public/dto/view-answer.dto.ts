export class ViewAnswerDto {
  questionId: string;
  answerStatus: 'Correct' | 'Incorrect';
  addedAt: string;
}
