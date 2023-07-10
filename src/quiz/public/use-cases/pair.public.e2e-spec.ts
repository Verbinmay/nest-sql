import {
  info,
  createUserInput,
  createBlogInput,
  createQuestionInput,
} from '../../../../test/functionTest';
import supertest from 'supertest';

import { INestApplication } from '@nestjs/common';
import { TestingModule, Test } from '@nestjs/testing';
import { faker } from '@faker-js/faker';

import { SAViewUserDto } from '../../../sa/dto/user/sa-view-user.dto';
import { createApp } from '../../../helpers/createApp';
import { ViewQuestionDto } from '../../sa/dto/view-question.dto';
import { AppModule } from '../../../app.module';
import { Question } from '../../entities/question.entity';
import { ViewAnswerDto } from '../dto/view-answer.dto';
import { ViewPairDto } from '../dto/view-pair.dto';

describe('pair-public-tests-pack', () => {
  jest.setTimeout(1000 * 1000);
  let app: INestApplication;
  let fullApp: INestApplication;
  let agent: supertest.SuperAgentTest;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    //преобразование апп
    fullApp = createApp(app);
    await fullApp.init();
    agent = supertest.agent(fullApp.getHttpServer());
  });

  afterAll(async () => {
    await fullApp.close();
  });

  describe('create.pair.public', () => {
    const users: Array<SAViewUserDto> = [];
    const accessTokens: Array<string> = [];
    const questions: Array<ViewQuestionDto> = [];

    beforeAll(async () => {
      await agent.delete(info.testingDelete);

      for (let i = 0; i < 2; i++) {
        const userInput = createUserInput();
        const userResponse = await agent
          .post(info.sa.users)
          .auth(info.sa.saLogin, info.sa.saPassword)
          .send(userInput)
          .expect(201);

        users.push(userResponse.body);

        const loginInput = {
          loginOrEmail: userInput.login,
          password: userInput.password,
        };
        const loginResponse = await agent
          .post(info.auth.login)
          .send(loginInput)
          .expect(200);

        accessTokens.push(loginResponse.body.accessToken);
      }
      for (let i = 0; i < 7; i++) {
        const questionInput = createQuestionInput();
        const questionsResponse = await agent
          .post(info.sa.questions)
          .auth(info.sa.saLogin, info.sa.saPassword)
          .send(questionInput)
          .expect(201);

        questions.push(questionsResponse.body);
      }
      for (let i = 0; i < 5; i++) {
        const updatePublishedQuestionsResponse = await agent
          .put(info.sa.questions + questions[i].id + info.publish)
          .auth(info.sa.saLogin, info.sa.saPassword)
          .send({
            published: true,
          })
          .expect(204);
      }
    });

    it('create connection second - 400 - view error - no published question', async () => {
      const updatePublishedQuestionsResponse = await agent
        .put(info.sa.questions + questions[0].id + info.publish)
        .auth(info.sa.saLogin, info.sa.saPassword)
        .send({
          published: false,
        })
        .expect(204);

      const connectionResponse = await agent
        .post(info.pairs.connection)
        .auth(accessTokens[1], { type: 'bearer' })
        .send()
        .expect(404);

      const returnPublishedQuestionsResponse = await agent
        .put(info.sa.questions + questions[0].id + info.publish)
        .auth(info.sa.saLogin, info.sa.saPassword)
        .send({
          published: true,
        })
        .expect(204);
    });

    it('create connection first - 200', async () => {
      const connectionResponse = await agent
        .post(info.pairs.connection)
        .auth(accessTokens[0], { type: 'bearer' })
        .send()
        .expect(200);

      expect(connectionResponse.body).toMatchObject<ViewPairDto>;
      const connection: ViewPairDto = connectionResponse.body;
      expect(connection.firstPlayerProgress.player.id).toBe(users[0].id);
      expect(connection.firstPlayerProgress.player.login).toBe(users[0].login);
      expect(connection.firstPlayerProgress.answers.length).toBe(0);
      expect(connection.firstPlayerProgress.score).toBe(0);
      expect(connection.secondPlayerProgress).toBe(null);
      expect(connection.questions).toBe(null);
      expect(connection.startGameDate).toBe(null);
      expect(connection.finishGameDate).toBe(null);
      expect(connection.pairCreatedDate).toEqual(expect.any(String));
      expect(connection.status).toBe('PendingSecondPlayer');
    });

    it('create connection second - 200', async () => {
      const connectionResponse = await agent
        .post(info.pairs.connection)
        .auth(accessTokens[1], { type: 'bearer' })
        .send()
        .expect(200);

      expect(connectionResponse.body).toMatchObject<ViewPairDto>;
      const connection: ViewPairDto = connectionResponse.body;
      expect(connection.firstPlayerProgress.player.id).toBe(users[0].id);
      expect(connection.firstPlayerProgress.player.login).toBe(users[0].login);
      expect(connection.firstPlayerProgress.answers.length).toBe(0);
      expect(connection.firstPlayerProgress.score).toBe(0);

      expect(connection.secondPlayerProgress.player.id).toBe(users[1].id);
      expect(connection.secondPlayerProgress.player.login).toBe(users[1].login);
      expect(connection.secondPlayerProgress.answers.length).toBe(0);
      expect(connection.secondPlayerProgress.score).toBe(0);

      expect(connection.questions.length).toBe(5);
      expect(connection.startGameDate).toEqual(expect.any(String));
      expect(connection.finishGameDate).toBe(null);
      expect(connection.pairCreatedDate).toEqual(expect.any(String));
      expect(connection.status).toBe('Active');
    });

    it('create connection first - 401', async () => {
      const connectionResponse = await agent
        .post(info.pairs.connection)
        .send()
        .expect(401);
    });
    it('create connection first - 403', async () => {
      const connectionResponse = await agent
        .post(info.pairs.connection)
        .auth(accessTokens[0], { type: 'bearer' })
        .send()
        .expect(403);
    });
  });

  describe('get.current.pair.public', () => {
    const users: Array<SAViewUserDto> = [];
    const accessTokens: Array<string> = [];
    const questions: Array<ViewQuestionDto> = [];

    beforeAll(async () => {
      await agent.delete(info.testingDelete);

      for (let i = 0; i < 2; i++) {
        const userInput = createUserInput();
        const userResponse = await agent
          .post(info.sa.users)
          .auth(info.sa.saLogin, info.sa.saPassword)
          .send(userInput)
          .expect(201);

        users.push(userResponse.body);

        const loginInput = {
          loginOrEmail: userInput.login,
          password: userInput.password,
        };
        const loginResponse = await agent
          .post(info.auth.login)
          .send(loginInput)
          .expect(200);

        accessTokens.push(loginResponse.body.accessToken);
      }
      for (let i = 0; i < 7; i++) {
        const questionInput = createQuestionInput();
        const questionsResponse = await agent
          .post(info.sa.questions)
          .auth(info.sa.saLogin, info.sa.saPassword)
          .send(questionInput)
          .expect(201);

        questions.push(questionsResponse.body);
      }
      for (let i = 0; i < 5; i++) {
        const updatePublishedQuestionsResponse = await agent
          .put(info.sa.questions + questions[i].id + info.publish)
          .auth(info.sa.saLogin, info.sa.saPassword)
          .send({
            published: true,
          })
          .expect(204);
      }
      const connectionResponse = await agent
        .post(info.pairs.connection)
        .auth(accessTokens[0], { type: 'bearer' })
        .send()
        .expect(200);
    });
    it('get my current game - 401', async () => {
      const getMyCurrentGameResponse = await agent
        .get(info.pairs.myCurrent)
        .expect(401);
    });
    it('get my current game - 404', async () => {
      const getMyCurrentGameResponse = await agent
        .get(info.pairs.myCurrent)
        .auth(accessTokens[1], { type: 'bearer' })
        .expect(404);
    });
    it('get my current game - 200', async () => {
      const getMyCurrentGameResponse = await agent
        .get(info.pairs.myCurrent)
        .auth(accessTokens[0], { type: 'bearer' })
        .expect(200);

      expect(getMyCurrentGameResponse.body).toMatchObject<ViewPairDto>;
      const myCurrentGame: ViewPairDto = getMyCurrentGameResponse.body;
      expect(myCurrentGame.firstPlayerProgress.player.id).toBe(users[0].id);
      expect(myCurrentGame.firstPlayerProgress.player.login).toBe(
        users[0].login,
      );
      expect(myCurrentGame.firstPlayerProgress.answers.length).toBe(0);
      expect(myCurrentGame.firstPlayerProgress.score).toBe(0);
      expect(myCurrentGame.secondPlayerProgress).toBe(null);
      expect(myCurrentGame.questions).toBe(null);
      expect(myCurrentGame.startGameDate).toBe(null);
      expect(myCurrentGame.finishGameDate).toBe(null);
      expect(myCurrentGame.pairCreatedDate).toEqual(expect.any(String));
      expect(myCurrentGame.status).toBe('PendingSecondPlayer');

      const connectionResponse = await agent
        .post(info.pairs.connection)
        .auth(accessTokens[1], { type: 'bearer' })
        .send()
        .expect(200);

      const getMyCurrentGameResponse2 = await agent
        .get(info.pairs.myCurrent)
        .auth(accessTokens[0], { type: 'bearer' })
        .expect(200);

      expect(getMyCurrentGameResponse2.body).toMatchObject<ViewPairDto>;
      const MyCurrentGame2: ViewPairDto = getMyCurrentGameResponse2.body;
      expect(MyCurrentGame2.firstPlayerProgress.player.id).toBe(users[0].id);
      expect(MyCurrentGame2.firstPlayerProgress.player.login).toBe(
        users[0].login,
      );
      expect(MyCurrentGame2.firstPlayerProgress.answers.length).toBe(0);
      expect(MyCurrentGame2.firstPlayerProgress.score).toBe(0);

      expect(MyCurrentGame2.secondPlayerProgress.player.id).toBe(users[1].id);
      expect(MyCurrentGame2.secondPlayerProgress.player.login).toBe(
        users[1].login,
      );
      expect(MyCurrentGame2.secondPlayerProgress.answers.length).toBe(0);
      expect(MyCurrentGame2.secondPlayerProgress.score).toBe(0);

      expect(MyCurrentGame2.questions.length).toBe(5);
      expect(MyCurrentGame2.startGameDate).toEqual(expect.any(String));
      expect(MyCurrentGame2.finishGameDate).toBe(null);
      expect(MyCurrentGame2.pairCreatedDate).toEqual(expect.any(String));
      expect(MyCurrentGame2.status).toBe('Active');
    });
  });

  describe('get.pair.by.id.public', () => {
    const users: Array<SAViewUserDto> = [];
    const accessTokens: Array<string> = [];
    const questions: Array<ViewQuestionDto> = [];
    const connections: Array<ViewPairDto> = [];
    beforeAll(async () => {
      await agent.delete(info.testingDelete);

      for (let i = 0; i < 2; i++) {
        const userInput = createUserInput();
        const userResponse = await agent
          .post(info.sa.users)
          .auth(info.sa.saLogin, info.sa.saPassword)
          .send(userInput)
          .expect(201);

        users.push(userResponse.body);

        const loginInput = {
          loginOrEmail: userInput.login,
          password: userInput.password,
        };
        const loginResponse = await agent
          .post(info.auth.login)
          .send(loginInput)
          .expect(200);

        accessTokens.push(loginResponse.body.accessToken);
      }
      for (let i = 0; i < 7; i++) {
        const questionInput = createQuestionInput();
        const questionsResponse = await agent
          .post(info.sa.questions)
          .auth(info.sa.saLogin, info.sa.saPassword)
          .send(questionInput)
          .expect(201);

        questions.push(questionsResponse.body);
      }
      for (let i = 0; i < 5; i++) {
        const updatePublishedQuestionsResponse = await agent
          .put(info.sa.questions + questions[i].id + info.publish)
          .auth(info.sa.saLogin, info.sa.saPassword)
          .send({
            published: true,
          })
          .expect(204);
      }
      const connectionResponse = await agent
        .post(info.pairs.connection)
        .auth(accessTokens[0], { type: 'bearer' })
        .send()
        .expect(200);

      connections.push(connectionResponse.body);
    });

    it('get game by id - 401', async () => {
      const getGameResponse = await agent
        .get(info.pairs.pairs + connections[0].id)
        .expect(401);
    });

    it('get game by id - 404', async () => {
      const getGameResponse = await agent
        .get(info.pairs.pairs + faker.datatype.number())
        .auth(accessTokens[0], { type: 'bearer' })
        .expect(404);
    });

    it('get game by id - 403', async () => {
      const getGameResponse = await agent
        .get(info.pairs.pairs + connections[0].id)
        .auth(accessTokens[1], { type: 'bearer' })
        .expect(403);
    });

    it('get game by id - 200', async () => {
      const getGameResponse = await agent
        .get(info.pairs.pairs + connections[0].id)
        .auth(accessTokens[0], { type: 'bearer' })
        .expect(200);

      expect(getGameResponse.body).toMatchObject<ViewPairDto>;
      const myCurrentGame: ViewPairDto = getGameResponse.body;
      expect(myCurrentGame.firstPlayerProgress.player.id).toBe(users[0].id);
      expect(myCurrentGame.firstPlayerProgress.player.login).toBe(
        users[0].login,
      );
      expect(myCurrentGame.firstPlayerProgress.answers.length).toBe(0);
      expect(myCurrentGame.firstPlayerProgress.score).toBe(0);
      expect(myCurrentGame.secondPlayerProgress).toBe(null);
      expect(myCurrentGame.questions).toBe(null);
      expect(myCurrentGame.startGameDate).toBe(null);
      expect(myCurrentGame.finishGameDate).toBe(null);
      expect(myCurrentGame.pairCreatedDate).toEqual(expect.any(String));
      expect(myCurrentGame.status).toBe('PendingSecondPlayer');

      const connectionResponse = await agent
        .post(info.pairs.connection)
        .auth(accessTokens[1], { type: 'bearer' })
        .send()
        .expect(200);

      const getGameResponse2 = await agent
        .get(info.pairs.pairs + connections[0].id)
        .auth(accessTokens[0], { type: 'bearer' })
        .expect(200);
      console.log(getGameResponse2.body);

      expect(getGameResponse2.body).toMatchObject<ViewPairDto>;
      const MyCurrentGame2: ViewPairDto = getGameResponse2.body;
      expect(MyCurrentGame2.firstPlayerProgress.player.id).toBe(users[0].id);
      expect(MyCurrentGame2.firstPlayerProgress.player.login).toBe(
        users[0].login,
      );
      expect(MyCurrentGame2.firstPlayerProgress.answers.length).toBe(0);
      expect(MyCurrentGame2.firstPlayerProgress.score).toBe(0);

      expect(MyCurrentGame2.secondPlayerProgress.player.id).toBe(users[1].id);
      expect(MyCurrentGame2.secondPlayerProgress.player.login).toBe(
        users[1].login,
      );
      expect(MyCurrentGame2.secondPlayerProgress.answers.length).toBe(0);
      expect(MyCurrentGame2.secondPlayerProgress.score).toBe(0);

      expect(MyCurrentGame2.questions.length).toBe(5);
      expect(MyCurrentGame2.startGameDate).toEqual(expect.any(String));
      expect(MyCurrentGame2.finishGameDate).toBe(null);
      expect(MyCurrentGame2.pairCreatedDate).toEqual(expect.any(String));
      expect(MyCurrentGame2.status).toBe('Active');
    });
  });

  describe('create.answer.public', () => {
    const users: Array<SAViewUserDto> = [];
    const accessTokens: Array<string> = [];
    const questions: Array<ViewQuestionDto> = [];
    const connections: Array<ViewPairDto> = [];
    beforeAll(async () => {
      await agent.delete(info.testingDelete);

      for (let i = 0; i < 2; i++) {
        const userInput = createUserInput();
        const userResponse = await agent
          .post(info.sa.users)
          .auth(info.sa.saLogin, info.sa.saPassword)
          .send(userInput)
          .expect(201);

        users.push(userResponse.body);

        const loginInput = {
          loginOrEmail: userInput.login,
          password: userInput.password,
        };
        const loginResponse = await agent
          .post(info.auth.login)
          .send(loginInput)
          .expect(200);

        accessTokens.push(loginResponse.body.accessToken);
      }
      for (let i = 0; i < 7; i++) {
        const questionInput = createQuestionInput();
        const questionsResponse = await agent
          .post(info.sa.questions)
          .auth(info.sa.saLogin, info.sa.saPassword)
          .send(questionInput)
          .expect(201);

        questions.push(questionsResponse.body);
      }
      for (let i = 0; i < 5; i++) {
        const updatePublishedQuestionsResponse = await agent
          .put(info.sa.questions + questions[i].id + info.publish)
          .auth(info.sa.saLogin, info.sa.saPassword)
          .send({
            published: true,
          })
          .expect(204);
      }
      const connectionResponse = await agent
        .post(info.pairs.connection)
        .auth(accessTokens[0], { type: 'bearer' })
        .send()
        .expect(200);

      connections.push(connectionResponse.body);
    });
    it(' create answer - 401', async () => {
      const createAnswerResponse = await agent
        .post(info.pairs.answer)
        .send()
        .expect(401);
    });
    it(' create answer - 403 -  not inside active pair', async () => {
      const createAnswerResponse = await agent
        .post(info.pairs.answer)
        .auth(accessTokens[0], { type: 'bearer' })
        .send({ answer: 'ggg' })
        .expect(403);
    });

    it(' create answer - 200', async () => {
      const connectionResponse = await agent
        .post(info.pairs.connection)
        .auth(accessTokens[1], { type: 'bearer' })
        .send()
        .expect(200);

      const getGameResponse1 = await agent
        .get(info.pairs.pairs + connections[0].id)
        .auth(accessTokens[0], { type: 'bearer' })
        .expect(200);

      const game: ViewPairDto = getGameResponse1.body;
      console.log(game, 'game');
      console.log(game.questions, 'questions');

      const answer = questions.find((q) => q.id === game.questions[0].id);

      const createAnswerResponse = await agent
        .post(info.pairs.answer)
        .auth(accessTokens[0], { type: 'bearer' })
        .send({ answer: answer.correctAnswers[0] })
        .expect(200);

      expect(createAnswerResponse.body).toMatchObject<ViewAnswerDto>;
      expect(createAnswerResponse.body.questionId).toBe(game.questions[0].id);
      expect(createAnswerResponse.body.answerStatus).toBe('Correct');

      const getGameResponse2 = await agent
        .get(info.pairs.pairs + connections[0].id)
        .auth(accessTokens[0], { type: 'bearer' })
        .expect(200);

      const updatedGame: ViewPairDto = getGameResponse2.body;
      expect(updatedGame.firstPlayerProgress.score).toBe(1);
      expect(updatedGame.secondPlayerProgress.score).toBe(0);

      const createWRONGAnswerResponse2 = await agent
        .post(info.pairs.answer)
        .auth(accessTokens[0], { type: 'bearer' })
        .send({ answer: 'wrong' })
        .expect(200);

      expect(createWRONGAnswerResponse2.body).toMatchObject<ViewAnswerDto>;
      expect(createWRONGAnswerResponse2.body.questionId).toBe(
        game.questions[1].id,
      );
      expect(createWRONGAnswerResponse2.body.answerStatus).toBe('Incorrect');

      const getGameResponse3 = await agent
        .get(info.pairs.pairs + connections[0].id)
        .auth(accessTokens[0], { type: 'bearer' })
        .expect(200);

      const updatedGame3: ViewPairDto = getGameResponse3.body;
      console.log(updatedGame3, 'updatedGame3');
      expect(updatedGame3.firstPlayerProgress.score).toBe(1);
      expect(updatedGame3.secondPlayerProgress.score).toBe(0);

      for (let i = 0; i < 5; i++) {
        const question = questions.find((q) => q.id === game.questions[i].id);

        const createAnswerResponse = await agent
          .post(info.pairs.answer)
          .auth(accessTokens[1], { type: 'bearer' })
          .send({ answer: question.correctAnswers[0] })
          .expect(200);
      }

      const createAnswerSIXTHResponse = await agent
        .post(info.pairs.answer)
        .auth(accessTokens[1], { type: 'bearer' })
        .send({ answer: answer.correctAnswers[0] })
        .expect(403);

      for (let i = 2; i < 5; i++) {
        const question = questions.find((q) => q.id === game.questions[i].id);

        const createAnswerResponse = await agent
          .post(info.pairs.answer)
          .auth(accessTokens[0], { type: 'bearer' })
          .send({ answer: question.correctAnswers[0] })
          .expect(200);

        console.log(createAnswerResponse.body);
      }
      const getGameResponse4 = await agent
        .get(info.pairs.pairs + connections[0].id)
        .auth(accessTokens[0], { type: 'bearer' })
        .expect(200);
      console.log(getGameResponse4.body, 'getGameResponse4');
      console.log(getGameResponse4.body.firstPlayerProgress.answers, 'f');
      console.log(getGameResponse4.body.secondPlayerProgress.answers, 's');

      const finishedGame: ViewPairDto = getGameResponse4.body;
      expect(finishedGame.firstPlayerProgress.score).toBe(4);
      expect(finishedGame.secondPlayerProgress.score).toBe(6);
    });
  });
});
