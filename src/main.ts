import axios from 'axios';
import { log } from 'console';
import * as ngrok from 'ngrok';
import { env } from 'process';

import { NestFactory } from '@nestjs/core';

import { createApp } from './helpers/createApp';
import { AppModule } from './app.module';

const settings = {
  currentAppBaseUrl: process.env.CURRENT_APP_BASE_URL,
  token: process.env.TOKEN_TG,
};

async function SendOurHookToTelegram(url: string) {
  await axios.post(`https://api.telegram.org/bot${settings.token}/setWebhook`, {
    url: url,
  });
  return;
}
async function connectToNgrok() {
  const url = await ngrok.connect(3000);
  log(url);
  return url;
}

async function bootstrap() {
  /*{ abortOnError: false } По умолчанию, если при создании приложения произойдет какая-либо ошибка, ваше приложение выйдет с кодом 1. Если вы хотите, чтобы он выдавал ошибку, отключите эту опцию abortOnError */
  const app = await NestFactory.create(AppModule, { abortOnError: false });

  /*Уведены в helper  все накручивания на апп, чтобы дублировать на тесты */
  const fullApp = createApp(app);

  await fullApp.listen(3000);

  let baseUrl = settings.currentAppBaseUrl;
  if (process.env.NODE_ENV === 'development') {
    baseUrl = await connectToNgrok();
  }
  await SendOurHookToTelegram(baseUrl + '/integrations/telegram/webhook');
}
bootstrap();
