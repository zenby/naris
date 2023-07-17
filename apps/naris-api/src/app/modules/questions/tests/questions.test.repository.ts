import { FindOptionsWhere, SaveOptions, DeepPartial, DeleteResult, FindOperator } from 'typeorm';

import { QuestionEntity } from '../question.entity';
import { testQuestions, newUserQuestion } from './questions-test-data';

export class QuestionsTestRepository {
  private readonly questions = testQuestions;

  create(entityLike: DeepPartial<QuestionEntity>): QuestionEntity {
    const { question, url, userUuid } = entityLike;
    const newQuestionEntity = new QuestionEntity();
    Object.assign(newQuestionEntity, {
      question,
      url,
      userUuid,
    });

    return newQuestionEntity;
  }

  async delete(criteria: FindOptionsWhere<QuestionEntity>): Promise<DeleteResult> {
    const deleteResult = new DeleteResult();

    if (this.isQuestionExist(+criteria.id)) {
      Object.assign(deleteResult, {
        affected: 1,
      });

      return deleteResult;
    }

    Object.assign(deleteResult, {
      affected: 0,
    });

    return deleteResult;
  }

  async find(): Promise<QuestionEntity[]> {
    return this.questions;
  }

  async findBy(where: FindOptionsWhere<QuestionEntity>): Promise<QuestionEntity[]> {
    return this.questions.filter((question) => question.userUuid === where.userUuid);
  }

  async findOneBy(where: FindOptionsWhere<QuestionEntity>): Promise<QuestionEntity | null> {
    return this.questions.find((existingQuestion) => existingQuestion.id === where.id) || null;
  }

  async save(entity: QuestionEntity, _options?: SaveOptions): Promise<QuestionEntity | null> {
    const newQuestionCopy = Object.assign({}, newUserQuestion);

    Object.assign(newQuestionCopy, entity);

    if (this.isQuestionExist(newQuestionCopy.id)) {
      return null;
    }
    return newQuestionCopy;
  }

  private isQuestionExist(questionId: number | FindOperator<number>): boolean {
    return !!this.questions.find((existingQuestion) => existingQuestion.id === questionId);
  }
}
