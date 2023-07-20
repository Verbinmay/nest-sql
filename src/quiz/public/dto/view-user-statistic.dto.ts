import { StatisticDTO } from './view-statistic.dto';

export class UserStatisticDTO extends StatisticDTO {
  player: {
    id: string;
    login: string;
  };
}
