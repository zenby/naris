import { INestApplication } from '@nestjs/common';
import * as supertest from 'supertest';
import { Repository, Equal } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Test } from '@nestjs/testing';
import { ConfigType } from '@nestjs/config';

import { HttpJsonStatus } from '@soer/sr-common-interfaces';
import {
  newQuestionText,
  expectedUserQuestions,
  expectedAllQuestions,
  userQuestion,
  expectedNewQuestion,
  newUserQuestion,
  strangerQuestionId,
  nonexistentQuestionId,
  userQuestionId,
  strangerUuid,
} from './tests/questions-test-data';
import { QuestionEntity } from './question.entity';
import { JwtConfig } from '../../config/jwt.config';
import { JwtTestHelper } from '../../common/helpers/JwtTestHelper';
import { QuestionsTestModule } from './tests/questions.test.module';

jest.mock('typeorm', () => {
  const originalModule = jest.requireActual('typeorm');

  return {
    __esModule: true,
    ...originalModule,
    Equal: jest.fn().mockImplementation((param) => param),
  };
});

describe('QuestionsModule e2e-test', () => {
  let app: INestApplication;
  let questionsRepo: Repository<QuestionEntity>;
  let request: ReturnType<typeof supertest>;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [QuestionsTestModule],
    })
      .useMocker((token) => {
        if (token == JwtConfig.KEY) {
          const jwtConfigMock: ConfigType<typeof JwtConfig> = { jwtSecret: JwtTestHelper.defaultSecret };
          return jwtConfigMock;
        }
      })
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();

    questionsRepo = app.get<Repository<QuestionEntity>>(getRepositoryToken(QuestionEntity));

    request = supertest(app.getHttpServer());
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /v1/questions', () => {
    test('should return all the questions when user uuid query param is not sent', async () => {
      const repoFindMethodSpy = jest.spyOn(questionsRepo, 'find');

      await request
        .get('/v1/questions')
        .set(JwtTestHelper.createBearerHeader())
        .expect(200, { status: HttpJsonStatus.Ok, items: expectedAllQuestions });

      expect(repoFindMethodSpy).toHaveBeenCalled();
    });
  });

  describe('GET /v1/questions?userUuid=userUuid', () => {
    test('should return all the questions of the current user when a userUuid query param matches the current user uuid', async () => {
      const repoFindByMethodSpy = jest.spyOn(questionsRepo, 'findBy');

      await request
        .get(`/v1/questions?userUuid=${JwtTestHelper.defaultPayload.uuid}`)
        .set(JwtTestHelper.createBearerHeader())
        .expect(200, { status: HttpJsonStatus.Ok, items: expectedUserQuestions });

      expect(repoFindByMethodSpy).toHaveBeenCalledWith({ userUuid: Equal(userQuestion.userUuid) });
    });
  });

  describe('POST /v1/questions', () => {
    test('should create a question when valid question dto is passed', async () => {
      const repoCreateMethodSpy = jest.spyOn(questionsRepo, 'create');
      const repoSaveMethodSpy = jest.spyOn(questionsRepo, 'save');

      await request
        .post('/v1/questions')
        .set(JwtTestHelper.createBearerHeader())
        .send({ question: newQuestionText, userUuid: JwtTestHelper.defaultPayload.uuid })
        .expect(201, { status: HttpJsonStatus.Ok, items: [expectedNewQuestion] });

      expect(repoCreateMethodSpy).toHaveBeenCalledWith({
        question: newUserQuestion.question,
        url: newUserQuestion.url,
        userUuid: newUserQuestion.userUuid,
      });
      expect(repoSaveMethodSpy).toHaveBeenCalled();
    });

    test('should return a Bad Request error when an empty question is passed', async () => {
      await request
        .post('/v1/questions')
        .set(JwtTestHelper.createBearerHeader())
        .send({ question: '', userUuid: JwtTestHelper.defaultPayload.uuid })
        .expect(400);
    });

    test("should return a Forbidden error when creator uuid doens't match the current user uuid", async () => {
      await request
        .post('/v1/questions')
        .set(JwtTestHelper.createBearerHeader())
        .send({ question: newUserQuestion.question, userUuid: strangerUuid })
        .expect(403);
    });
  });

  describe('DELETE /v1/questions/:qid', () => {
    test('should delete a question when the question belongs to the current user', async () => {
      const repoDeleteMethodSpy = jest.spyOn(questionsRepo, 'delete');

      await request
        .delete(`/v1/questions/${userQuestionId}`)
        .set(JwtTestHelper.createBearerHeader())
        .expect(200, { status: HttpJsonStatus.Ok, items: [] });

      expect(repoDeleteMethodSpy).toHaveBeenCalledWith({ id: userQuestionId.toString() });
    });

    test('should throw a not found error when the question does not exist', async () => {
      await request
        .delete(`/v1/questions/${nonexistentQuestionId}`)
        .set(JwtTestHelper.createBearerHeader())
        .expect(404);
    });

    test('should throw an unauthorisized error when the question belongs to another user', async () => {
      await request.delete(`/v1/questions/${strangerQuestionId}`).set(JwtTestHelper.createBearerHeader()).expect(401);
    });
  });
});
