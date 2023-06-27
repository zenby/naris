import { CanActivate, ExecutionContext, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { QuestionEntity } from '../question.entity';
import { Repository } from 'typeorm';

@Injectable()
export class QuestionAuthGuard implements CanActivate {
  constructor(@InjectRepository(QuestionEntity) private readonly questionRepository: Repository<QuestionEntity>) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { user } = request;
    const { qid } = request.params;

    const question = await this.questionRepository.findOneBy({ id: +qid });

    if (!question) {
      throw new NotFoundException();
    }

    if (question && question.userUuid !== user.uuid) {
      throw new UnauthorizedException();
    }

    return true;
  }
}
