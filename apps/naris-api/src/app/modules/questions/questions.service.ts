import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Equal } from 'typeorm';
import { Repository } from 'typeorm';

import { JwtPayload } from '../../common/types/jwt-payload.interface';
import { QuestionEntity } from './question.entity';
import { QuestionSavingResult } from '../../common/types/question-saving-result';

@Injectable()
export class QuestionsService {
  constructor(@InjectRepository(QuestionEntity) private readonly questionRepository: Repository<QuestionEntity>) {}

  async create(
    { question, userId }: { question: string; userId: number },
    currentUser: JwtPayload
  ): Promise<QuestionSavingResult> {
    if (!this.isQuestionValid(question)) {
      return QuestionSavingResult.EmpryQuestionError;
    }

    if (!this.isCurrentUserId(userId, currentUser)) {
      return QuestionSavingResult.UnauthorizedUserError;
    }

    const userUuid = currentUser.uuid;
    const url = ''; // TODO: get data for url from auth-cdn
    const newQuestion = this.questionRepository.create({ question, url, userUuid });
    await this.questionRepository.insert(newQuestion);

    return QuestionSavingResult.Ok;
  }

  async remove({ questionId }: { questionId: number }, executor: JwtPayload) {
    throw new Error('Not implemented');
  }

  async getQuestions(userIdParam: string | null = null, currentUser: JwtPayload): Promise<QuestionEntity[]> {
    if (!userIdParam) {
      return await this.questionRepository.find();
    }

    if (this.isCurrentUserId(+userIdParam, currentUser)) {
      return await this.questionRepository.findBy({ userUuid: Equal(currentUser.uuid) });
    }

    return [];
  }

  async getForExecutor(executor: JwtPayload) {
    throw new Error('Not implemented');
  }

  private isCurrentUserId(userIdParam: number, currentUser: JwtPayload): boolean {
    return +userIdParam === currentUser.id;
  }

  private isQuestionValid(question: string): boolean {
    return question.length > 0;
  }
}
