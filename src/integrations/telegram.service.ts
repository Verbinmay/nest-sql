import axios from 'axios';
import { log } from 'console';

import { Injectable } from '@nestjs/common';

@Injectable()
export class TelegramAdapter {
  async sendSpam(telegramId: number, blogName: string) {
    try {
      const message = await axios.post(
        `https://api.telegram.org/bot${process.env.TOKEN_TG}/sendMessage`,
        {
          chat_id: telegramId,
          text: `New post published for blog "${blogName}"`,
        },
      );
    } catch (e) {
      console.error(e);
    }
  }
}
