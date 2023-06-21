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

import { ViewBlogDto } from '../../../blogger/dto/blog/view-blog.dto';
import { createApp } from '../../../helpers/createApp';
import { AppModule } from '../../../app.module';
import { ViewQuestionDto } from '../dto/view-question.dto';
import { Question } from '../entities/question.entity';

describe('questions-sa-tests-pack', () => {
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

  describe('getQuestions.sa', () => {
    beforeAll(async () => {
      await agent.delete(info.testingDelete);
    });

    it('get question - 200', async () => {
      const getQuestionsResponse = await agent
        .get(info.sa.questions)
        .auth(info.sa.saLogin, info.sa.saPassword)
        .expect(200);

      expect(getQuestionsResponse.body.items.length).toBe(0);
      expect(getQuestionsResponse.body.pagesCount).toBe(0);
      expect(getQuestionsResponse.body.page).toBe(1);
      expect(getQuestionsResponse.body.pageSize).toBe(10);
      expect(getQuestionsResponse.body.totalCount).toBe(0);

      const questionInput = createQuestionInput();
      const createQuestionsResponse = await agent
        .post(info.sa.questions)
        .auth(info.sa.saLogin, info.sa.saPassword)
        .send(questionInput)
        .expect(201);

      const getQuestionsResponse2 = await agent
        .get(info.sa.questions)
        .auth(info.sa.saLogin, info.sa.saPassword)
        .expect(200);

      expect(getQuestionsResponse2.body.items.length).toBe(1);
      expect(getQuestionsResponse2.body.items).toMatchObject<ViewQuestionDto>;
      expect(getQuestionsResponse2.body.items[0].body).toEqual(
        questionInput.body,
      );
      expect(getQuestionsResponse2.body.items[0].correctAnswers).toEqual(
        questionInput.correctAnswers.map((p) => p.toString()),
      );
      expect(getQuestionsResponse2.body.pagesCount).toBe(1);
      expect(getQuestionsResponse2.body.page).toBe(1);
      expect(getQuestionsResponse2.body.pageSize).toBe(10);
      expect(getQuestionsResponse2.body.totalCount).toBe(1);
    });

    it('get question - 401', async () => {
      await agent.get(info.sa.questions).expect(401);
    });
  });

  describe('createQuestions.sa', () => {
    beforeAll(async () => {
      await agent.delete(info.testingDelete);
    });

    it('create question - 201', async () => {
      const questionInput = createQuestionInput();
      const questionsResponse = await agent
        .post(info.sa.questions)
        .auth(info.sa.saLogin, info.sa.saPassword)
        .send(questionInput)
        .expect(201);

      expect(questionsResponse.body.body).toBe(questionInput.body);
      expect(questionsResponse.body.correctAnswers).toBe(
        questionInput.correctAnswers,
      );
    });
    it('create question - 401', async () => {
      const questionInput = createQuestionInput();
      const questionsResponse = await agent
        .post(info.sa.questions)
        .send(questionInput)
        .expect(401);
    });

    it('create question - 400 - body', async () => {
      const questionInput = createQuestionInput();
      const questionsResponse = await agent
        .post(info.sa.questions)
        .auth(info.sa.saLogin, info.sa.saPassword)
        .send({ ...questionInput, body: faker.datatype.number() })
        .expect(400);
    });

    it('create question - 400 - correctAnswers', async () => {
      const questionInput = createQuestionInput();
      const questionsResponse = await agent
        .post(info.sa.questions)
        .auth(info.sa.saLogin, info.sa.saPassword)
        .send({ ...questionInput, correctAnswers: faker.datatype.number() })
        .expect(400);
    });
  });
  describe('deleteQuestions.sa', () => {
    const questions: Array<Question> = [];
    beforeAll(async () => {
      await agent.delete(info.testingDelete);
      const questionInput = createQuestionInput();
      const questionsResponse = await agent
        .post(info.sa.questions)
        .auth(info.sa.saLogin, info.sa.saPassword)
        .send(questionInput)
        .expect(201);
      questions.push(questionsResponse.body);
    });

    it('delete question - 401', async () => {
      const delteQuestionsResponse = await agent
        .delete(info.sa.questions + questions[0].id)
        .expect(401);
    });

    it('delete question - 404', async () => {
      const delteQuestionsResponse = await agent
        .delete(info.sa.questions + faker.random.numeric)
        .auth(info.sa.saLogin, info.sa.saPassword)
        .expect(404);
    });

    it('delete question - 204', async () => {
      const delteQuestionsResponse = await agent
        .delete(info.sa.questions + questions[0].id)
        .auth(info.sa.saLogin, info.sa.saPassword)
        .expect(204);

      const getQuestionsResponse2 = await agent
        .get(info.sa.questions)
        .auth(info.sa.saLogin, info.sa.saPassword)
        .expect(200);

      expect(getQuestionsResponse2.body.items.length).toBe(0);
    });
  });
});
