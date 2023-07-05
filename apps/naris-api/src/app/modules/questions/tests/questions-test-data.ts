import { faker } from '@faker-js/faker';

import { QuestionEntity } from '../question.entity';
import { JwtTestHelper } from '../../../common/helpers/JwtTestHelper';

export const newQuestionText = faker.lorem.text();
export const userQuestionId = faker.datatype.number();
export const strangerQuestionId = faker.datatype.number();
export const nonexistentQuestionId = faker.datatype.number();

type QuestionData = {
  id?: number;
  createdAt?: Date;
  updatedAt?: Date;
  question?: string;
  url?: string;
  userUuid?: string;
};

const defaultQuestionData: QuestionData = {
  id: faker.datatype.number(),
  createdAt: faker.date.recent(),
  updatedAt: faker.date.recent(),
  question: faker.lorem.text(),
  url: '', // TODO: Instead of a real url now an empty string is hard-coded in the question service as static data url. It will be changed with a real url when auth-cdn starts serving static data
  userUuid: faker.datatype.uuid(),
};

const createQuestion = (questionData: QuestionData): QuestionEntity => {
  const newQuestion = new QuestionEntity();
  Object.assign(newQuestion, { ...defaultQuestionData, ...questionData });

  return newQuestion;
};

const createExpectedReply = (question: QuestionEntity | QuestionEntity[]): QuestionEntity[] =>
  JSON.parse(JSON.stringify(question));

export const userQuestion = createQuestion({ id: userQuestionId, userUuid: JwtTestHelper.defaultPayload.uuid });

const strangerQuestion = createQuestion({ id: strangerQuestionId, userUuid: faker.datatype.uuid() });

export const testQuestions: QuestionEntity[] = [userQuestion, strangerQuestion];

export const newUserQuestion = createQuestion({
  question: newQuestionText,
  userUuid: JwtTestHelper.defaultPayload.uuid,
});

export const expectedNewQuestion = createExpectedReply(newUserQuestion);

export const expectedAllQuestions = createExpectedReply(testQuestions);

export const expectedUserQuestions = createExpectedReply([userQuestion]);
