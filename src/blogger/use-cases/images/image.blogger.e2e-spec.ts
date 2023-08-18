import {
  info,
  createUserInput,
  createBlogInput,
} from '../../../../test/functionTest';
import supertest from 'supertest';

import { INestApplication } from '@nestjs/common';
import { TestingModule, Test } from '@nestjs/testing';
import { faker } from '@faker-js/faker';

import { SAViewUserDto } from '../../../sa/dto/user/sa-view-user.dto';
import { Blog } from '../../../entities/sql/blog.entity';
import { createApp } from '../../../helpers/createApp';
import { ViewBlogDto } from '../../dto/blog/view-blog.dto';
import { AppModule } from '../../../app.module';

describe('blog-blogger-tests-pack', () => {
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

  describe('create.blog.blogger', () => {
    let accessToken;
    let blog: Blog;
    beforeAll(async () => {
      await agent.delete(info.testingDelete);
      const userInput = createUserInput();
      const user = await agent
        .post(info.sa.users)
        .auth(info.sa.saLogin, info.sa.saPassword)
        .send(userInput)
        .expect(201);
      const loginInput = {
        loginOrEmail: userInput.login,
        password: userInput.password,
      };
      const login = await agent
        .post(info.auth.login)
        .send(loginInput)
        .expect(200);

      accessToken = login.body.accessToken;

      const blogInput = createBlogInput();
      const blogRequest = await agent
        .post(info.blogger.blogs)
        .auth(accessToken, { type: 'bearer' })
        .send(blogInput)
        .expect(201);
      blog = blogRequest.body;
    });

    it('upload wallpaper for blog - 201', async () => {
      const wallpaper = await agent
        .post(info.blogger.blogs + blog.id + info.blogger.wallpaper)
        .auth(accessToken, { type: 'bearer' })
        .attach('image')
        .expect(201);

      expect(blog.body).toMatchObject<ViewBlogDto>;
      expect(blog.body.name).toBe(blogInput.name);
      expect(blog.body.description).toBe(blogInput.description);
      expect(blog.body.websiteUrl).toBe(blogInput.websiteUrl);
    });
  });
});
