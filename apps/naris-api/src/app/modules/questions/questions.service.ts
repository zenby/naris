import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Equal, DeleteResult } from 'typeorm';
import { Repository } from 'typeorm';

import { QuestionEntity } from './question.entity';
import { CreateQuestionDto } from './dto/create-question.dto';
import { JwtPayload } from '../../common/types/jwt-payload.interface';

@Injectable()
export class QuestionsService {
  constructor(@InjectRepository(QuestionEntity) private readonly questionRepository: Repository<QuestionEntity>) {}

  async create({ question }: CreateQuestionDto, user: JwtPayload): Promise<QuestionEntity | Error> {
    const url = ''; // TODO: get data for url from auth-cdn
    const newQuestion = this.questionRepository.create({ question, url, userUuid: user.uuid });
    return await this.questionRepository.save(newQuestion);
  }

  async remove({ questionId }: { questionId: number }): Promise<DeleteResult | Error> {
    return await this.questionRepository.delete({ id: questionId });
  }

  async getQuestions(userUuidParam: string | null = null): Promise<QuestionEntity[]> {
    if (userUuidParam) {
      return await this.questionRepository.findBy({ userUuid: Equal(userUuidParam) });
    }

    return await this.questionRepository.find();
  }

  async getQuestionById(questionId: number): Promise<QuestionEntity | null> {
    return await this.questionRepository.findOneBy({ id: questionId });
  }
}
