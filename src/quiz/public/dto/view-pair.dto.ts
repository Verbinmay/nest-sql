import { ViewAnswerDto } from './view-answer.dto';

export class PlayerProgress {
  answers: Array<ViewAnswerDto>;
  player: {
    id: string;
    login: string;
  };
  score: number;
}

export class ViewPairDto {
  id: string;
  firstPlayerProgress: PlayerProgress;
  secondPlayerProgress: PlayerProgress | null;
  questions: Array<{
    id: string;
    body: string;
  }> | null;
  status: 'PendingSecondPlayer' | 'Active' | 'Finished';
  pairCreatedDate: string;
  startGameDate: string | null;
  finishGameDate: string | null;
}
