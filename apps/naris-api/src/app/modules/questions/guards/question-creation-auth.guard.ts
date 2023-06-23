import { CanActivate, ExecutionContext, Injectable, ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { QuestionEntity } from '../question.entity';
import messages from '../constants/messages';

@Injectable()
export class QuestionCreationAuthGuard implements CanActivate {
  constructor(@InjectRepository(QuestionEntity) private readonly questionRepository: Repository<QuestionEntity>) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { user, body } = request;

    if (user.uuid !== body.userUuid) {
      throw new ForbiddenException(messages.questionCreationForbiddenError);
    }

    return true;
  }
}
