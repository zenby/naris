import { CanActivate, ExecutionContext, Injectable, ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { QuestionEntity } from '../question.entity';
import messages from '../constants/messages';

@Injectable()
export class QuestionGettingAuthGuard implements CanActivate {
  constructor(@InjectRepository(QuestionEntity) private readonly questionRepository: Repository<QuestionEntity>) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { user, query } = request;
    const { userUuid } = query;

    if (!userUuid) {
      return true;
    }

    if (user.uuid !== userUuid) {
      throw new ForbiddenException(messages.questionGettingForbiddenError);
    }

    return true;
  }
}
