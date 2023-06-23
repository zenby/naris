import { QuestionsModule } from './questions.module';
import { INestApplication } from '@nestjs/common';
import * as supertest from 'supertest';
import { Repository, Equal } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Test } from '@nestjs/testing';
import { ConfigType } from '@nestjs/config';
import { faker } from '@faker-js/faker';

import { HttpJsonStatus } from '@soer/sr-common-interfaces';
import { QuestionEntity } from './question.entity';
import { JwtConfig } from '../../config/jwt.config';
import { JwtTestHelper } from '../../common/helpers/JwtTestHelper';
import messages from './constants/messages';

const questionsRepositoryMock = {
  create: jest.fn(),
  delete: jest.fn(),
  find: jest.fn(),
  findBy: jest.fn(),
  insert: jest.fn(),
};

const fakeQuestionText = faker.lorem.text();
const fakeQuestionId = faker.datatype.number();

const fakeQuestion = {
  id: fakeQuestionId,
  createdAt: faker.date.recent().toString(),
  updatedAt: faker.date.recent().toString(),
  question: fakeQuestionText,
  url: '',
  userUuid: JwtTestHelper.defaultPayload.uuid,
};

describe('QuestionsModule e2e-test', () => {
  let app: INestApplication;
  let questionsRepo: Repository<QuestionEntity>;
  let request: ReturnType<typeof supertest>;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [QuestionsModule],
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

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /v1/questions', () => {
    test('should return all the questions when userId query param is not sent', async () => {
      questionsRepositoryMock.find.mockReturnValueOnce([fakeQuestion]);

      await request
        .get('/v1/questions')
        .set(JwtTestHelper.createBearerHeader())
        .expect(200, { status: HttpJsonStatus.Ok, items: [fakeQuestion] });
    });
  });

  describe('GET /v1/questions?userId=userId', () => {
    test('should return all the questions of the current user when userId query param is sent', async () => {
      questionsRepositoryMock.findBy.mockReturnValueOnce([fakeQuestion]);

      await request
        .get(`/v1/questions?userId=${JwtTestHelper.defaultPayload.id}`)
        .set(JwtTestHelper.createBearerHeader())
        .expect(200, { status: HttpJsonStatus.Ok, items: [fakeQuestion] });
    });
  });

  describe('POST /v1/questions', () => {
    test('should create a question when valid question dto is passed', async () => {
      questionsRepositoryMock.create.mockReturnValueOnce(fakeQuestion);

      await request
        .post('/v1/questions')
        .set(JwtTestHelper.createBearerHeader())
        .send({ question: fakeQuestionText, userId: JwtTestHelper.defaultPayload.id })
        .expect(201, { status: HttpJsonStatus.Ok, items: [messages.questionCreated] });

      expect(questionsRepositoryMock.create).toHaveBeenCalledWith({
        question: fakeQuestion.question,
        url: fakeQuestion.url,
        userUuid: fakeQuestion.userUuid,
      });
    });

    test('should return an error message when an empty question is passed', async () => {
      await request
        .post('/v1/questions')
        .set(JwtTestHelper.createBearerHeader())
        .send({ question: '', userId: JwtTestHelper.defaultPayload.id })
        .expect(201, { status: HttpJsonStatus.Error, items: [messages.emptyQuestion] });

      expect(questionsRepositoryMock.create).not.toHaveBeenCalled();
    });

    test('should throw an unauthorized exception when an unauthorisized user is trying to create a question', async () => {
      await request
        .post('/v1/questions')
        .set(JwtTestHelper.createBearerHeader())
        .send({ question: fakeQuestionText, userId: faker.datatype.number() })
        .expect(401);

      expect(questionsRepositoryMock.create).not.toHaveBeenCalled();
    });
  });

  describe('DELETE /v1/questions/:qid', () => {
    test('should delete a question when an existing question id is passed', async () => {
      questionsRepositoryMock.delete.mockReturnValueOnce({ affected: faker.datatype.number({ min: 1 }) });

      await request
        .delete(`/v1/questions/${fakeQuestionId}`)
        .set(JwtTestHelper.createBearerHeader())
        .expect(200, { status: HttpJsonStatus.Ok, items: [messages.questionDeleted] });

      expect(questionsRepositoryMock.delete).toHaveBeenCalledWith({ id: fakeQuestionId.toString() });
    });

    test('should return an error message when the question with passed id does not exist in the database', async () => {
      questionsRepositoryMock.delete.mockReturnValueOnce({ affected: 0 });

      await request
        .delete(`/v1/questions/${fakeQuestionId}`)
        .set(JwtTestHelper.createBearerHeader())
        .expect(200, { status: HttpJsonStatus.Error, items: [messages.questionNotFound] });
    });
  });
});
