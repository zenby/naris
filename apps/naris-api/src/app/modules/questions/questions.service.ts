import { Injectable } from '@nestjs/common';
import { JwtPayload } from '../../common/types/jwt-payload.interface';

@Injectable()
export class QuestionsService {
  async create({ question }: { question: string }, executor: JwtPayload) {
    throw new Error('Not implemented');
  }

  async remove({ questionId }: { questionId: number }, executor: JwtPayload) {
    throw new Error('Not implemented');
  }

  async getAll() {
    throw new Error('Not implemented');
  }

  async getForExecutor(executor: JwtPayload) {
    throw new Error('Not implemented');
  }
}
