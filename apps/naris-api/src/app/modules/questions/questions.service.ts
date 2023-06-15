import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { JwtPayload } from '../../common/types/jwt-payload.interface';
import { QuestionEntity } from './question.entity';

@Injectable()
export class QuestionsService {
  constructor(@InjectRepository(QuestionEntity) private readonly questionRepository: Repository<QuestionEntity>) {}

  async create({ question }: { question: string }, executor: JwtPayload) {
    throw new Error('Not implemented');
  }

  async remove({ questionId }: { questionId: number }, executor: JwtPayload) {
    throw new Error('Not implemented');
  }

  async getQuestions(): Promise<QuestionEntity[]> {
    return await this.questionRepository.find();
  }

  async getForExecutor(executor: JwtPayload) {
    throw new Error('Not implemented');
  }
}
